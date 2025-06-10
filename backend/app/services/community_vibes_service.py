"""
Community Vibes service for managing user-generated recipes.
Handles all business logic for Community Vibes recipes including CRUD operations,
ratings, favorites, and community features.
"""

import logging
import math
from datetime import datetime, UTC
from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID

from app.models.community_vibes import (
    CommunityVibeRecipe,
    CommunityVibeRecipeCreate,
    CommunityVibeRecipeUpdate,
    CommunityVibeRecipeResponse,
    CommunityVibeRecipeList,
    CommunityVibeRecipeFilters,
    RecipeRating,
    RecipeStats
)
from app.models.cocktail import CocktailRecipe, UserPreferences
from app.services.database import database_service

logger = logging.getLogger(__name__)

class CommunityVibesService:
    """Service for managing Community Vibes recipes and related operations."""
    
    def __init__(self):
        """Initialize the Community Vibes service."""
        self.db = database_service
        self.table_name = "community_vibes_recipes"
        self.ratings_table = "recipe_ratings"
    
    async def create_recipe_from_ai_generation(
        self, 
        ai_recipe: CocktailRecipe, 
        user_preferences: UserPreferences,
        creator_name: Optional[str] = None,
        creator_email: Optional[str] = None
    ) -> CommunityVibeRecipe:
        """
        Create a Community Vibe recipe from an AI-generated cocktail recipe.
        This is the main method called when users want to save their AI-generated recipes.
        """
        try:
            # Convert AI recipe to Community Vibe format
            recipe_data = CommunityVibeRecipeCreate(
                name=ai_recipe.recipeTitle,
                description=ai_recipe.recipeDescription,
                ingredients=ai_recipe.recipeIngredients,
                instructions=ai_recipe.recipeInstructions,
                meta=ai_recipe.recipeMeta,
                details=ai_recipe.recipeDetails,
                creator_name=creator_name,
                creator_email=creator_email,
                tags=user_preferences.flavors or [],
                flavor_profile=user_preferences.flavors or [],
                vibe=user_preferences.vibe,
                original_preferences=user_preferences.model_dump(),
                ai_model_used=user_preferences.model
            )
            
            # Extract metadata if available
            if ai_recipe.recipeMeta:
                for meta in ai_recipe.recipeMeta:
                    if "difficulty" in meta.text.lower():
                        recipe_data.difficulty_level = self._extract_difficulty(meta.text)
                    elif "prep" in meta.text.lower() or "time" in meta.text.lower():
                        recipe_data.prep_time_minutes = self._extract_prep_time(meta.text)
                    elif "serving" in meta.text.lower():
                        recipe_data.servings = self._extract_servings(meta.text)
            
            return await self.create_recipe(recipe_data)
            
        except Exception as e:
            logger.error(f"Failed to create Community Vibe recipe from AI generation: {str(e)}")
            raise
    
    async def create_recipe(self, recipe_data: CommunityVibeRecipeCreate) -> CommunityVibeRecipe:
        """Create a new Community Vibe recipe."""
        try:
            # Prepare data for database insertion
            db_data = recipe_data.model_dump()
            db_data["created_at"] = datetime.now(UTC).isoformat()
            db_data["updated_at"] = datetime.now(UTC).isoformat()
            
            # Convert lists to JSON for database storage
            db_data["ingredients"] = [ing.model_dump() for ing in recipe_data.ingredients]
            db_data["meta"] = [meta.model_dump() for meta in recipe_data.meta]
            db_data["details"] = [detail.model_dump() for detail in recipe_data.details]
            
            # Insert into database
            result = await self.db.create_record(self.table_name, db_data)
            
            # Convert back to Pydantic model
            recipe = await self._db_record_to_model(result)
            
            logger.info(f"Successfully created Community Vibe recipe: {recipe.name}")
            return recipe
            
        except Exception as e:
            logger.error(f"Failed to create Community Vibe recipe: {str(e)}")
            raise
    
    async def get_recipe(self, recipe_id: UUID) -> Optional[CommunityVibeRecipe]:
        """Get a Community Vibe recipe by ID."""
        try:
            result = await self.db.get_record(self.table_name, str(recipe_id))
            if result:
                # Increment view count
                await self._increment_view_count(recipe_id)
                return await self._db_record_to_model(result)
            return None
            
        except Exception as e:
            logger.error(f"Failed to get Community Vibe recipe {recipe_id}: {str(e)}")
            raise
    
    async def get_recipes(
        self, 
        filters: Optional[CommunityVibeRecipeFilters] = None,
        page: int = 1,
        per_page: int = 20
    ) -> CommunityVibeRecipeList:
        """Get a paginated list of Community Vibe recipes with optional filtering."""
        try:
            # Build database filters
            db_filters = {"is_public": True, "is_approved": True}
            
            if filters:
                if filters.creator_name:
                    db_filters["creator_name"] = filters.creator_name
                if filters.difficulty_level:
                    db_filters["difficulty_level"] = filters.difficulty_level
                if filters.vibe:
                    db_filters["vibe"] = filters.vibe
                if filters.is_featured is not None:
                    db_filters["is_featured"] = filters.is_featured
            
            # Calculate offset
            offset = (page - 1) * per_page
            
            # Get total count
            all_recipes = await self.db.get_records(self.table_name, db_filters)
            
            # Apply additional filters that can't be done at DB level
            filtered_recipes = await self._apply_advanced_filters(all_recipes, filters)
            
            total_count = len(filtered_recipes)
            total_pages = math.ceil(total_count / per_page)
            
            # Apply pagination
            paginated_recipes = filtered_recipes[offset:offset + per_page]
            
            # Convert to models
            recipes = []
            for record in paginated_recipes:
                recipe = await self._db_record_to_model(record)
                recipes.append(recipe)
            
            return CommunityVibeRecipeList(
                recipes=recipes,
                total_count=total_count,
                page=page,
                per_page=per_page,
                total_pages=total_pages
            )
            
        except Exception as e:
            logger.error(f"Failed to get Community Vibe recipes: {str(e)}")
            raise
    
    async def update_recipe(self, recipe_id: UUID, update_data: CommunityVibeRecipeUpdate) -> Optional[CommunityVibeRecipe]:
        """Update a Community Vibe recipe."""
        try:
            # Prepare update data
            db_data = update_data.model_dump(exclude_unset=True)
            db_data["updated_at"] = datetime.now(UTC).isoformat()
            
            # Convert complex fields to JSON if present
            if "ingredients" in db_data and db_data["ingredients"]:
                db_data["ingredients"] = [ing.model_dump() for ing in update_data.ingredients]
            if "meta" in db_data and db_data["meta"]:
                db_data["meta"] = [meta.model_dump() for meta in update_data.meta]
            if "details" in db_data and db_data["details"]:
                db_data["details"] = [detail.model_dump() for detail in update_data.details]
            
            # Update in database
            result = await self.db.update_record(self.table_name, str(recipe_id), db_data)
            
            # Convert back to model
            recipe = await self._db_record_to_model(result)
            
            logger.info(f"Successfully updated Community Vibe recipe: {recipe.name}")
            return recipe
            
        except Exception as e:
            logger.error(f"Failed to update Community Vibe recipe {recipe_id}: {str(e)}")
            raise
    
    async def delete_recipe(self, recipe_id: UUID) -> bool:
        """Delete a Community Vibe recipe."""
        try:
            result = await self.db.delete_record(self.table_name, str(recipe_id))
            
            if result:
                logger.info(f"Successfully deleted Community Vibe recipe {recipe_id}")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Failed to delete Community Vibe recipe {recipe_id}: {str(e)}")
            raise
    
    async def rate_recipe(self, rating_data: RecipeRating) -> bool:
        """Rate a Community Vibe recipe."""
        try:
            # Store the rating
            db_rating = rating_data.model_dump()
            db_rating["created_at"] = datetime.now(UTC).isoformat()
            
            await self.db.create_record(self.ratings_table, db_rating)
            
            # Update recipe rating statistics
            await self._update_recipe_rating_stats(rating_data.recipe_id)
            
            logger.info(f"Successfully rated recipe {rating_data.recipe_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to rate recipe {rating_data.recipe_id}: {str(e)}")
            raise
    
    async def get_community_stats(self) -> RecipeStats:
        """Get Community Vibes statistics."""
        try:
            # Get all public recipes
            recipes = await self.db.get_records(
                self.table_name, 
                {"is_public": True, "is_approved": True}
            )
            
            total_recipes = len(recipes)
            
            # Calculate unique creators
            creators = set()
            all_tags = []
            featured_count = 0
            total_rating = 0
            rated_recipes = 0
            
            for recipe in recipes:
                if recipe.get("creator_email"):
                    creators.add(recipe["creator_email"])
                elif recipe.get("creator_name"):
                    creators.add(recipe["creator_name"])
                
                if recipe.get("tags"):
                    all_tags.extend(recipe["tags"])
                
                if recipe.get("is_featured"):
                    featured_count += 1
                
                if recipe.get("rating_average") and recipe.get("rating_count", 0) > 0:
                    total_rating += recipe["rating_average"]
                    rated_recipes += 1
            
            # Calculate most popular tags
            tag_counts = {}
            for tag in all_tags:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
            
            most_popular_tags = sorted(tag_counts.keys(), key=lambda x: tag_counts[x], reverse=True)[:10]
            
            # Calculate average rating
            average_rating = total_rating / rated_recipes if rated_recipes > 0 else None
            
            return RecipeStats(
                total_recipes=total_recipes,
                total_creators=len(creators),
                average_rating=average_rating,
                most_popular_tags=most_popular_tags,
                featured_recipes_count=featured_count
            )
            
        except Exception as e:
            logger.error(f"Failed to get community stats: {str(e)}")
            raise
    
    async def search_recipes(self, search_term: str, limit: int = 20) -> List[CommunityVibeRecipe]:
        """Search Community Vibe recipes by name and description."""
        try:
            # Get all public recipes
            recipes = await self.db.get_records(
                self.table_name, 
                {"is_public": True, "is_approved": True},
                limit=100  # Limit initial fetch for performance
            )
            
            # Filter by search term
            search_lower = search_term.lower()
            matching_recipes = []
            
            for record in recipes:
                name = record.get("name", "").lower()
                description = record.get("description", "").lower()
                
                if search_lower in name or search_lower in description:
                    recipe = await self._db_record_to_model(record)
                    matching_recipes.append(recipe)
                
                if len(matching_recipes) >= limit:
                    break
            
            return matching_recipes
            
        except Exception as e:
            logger.error(f"Failed to search recipes: {str(e)}")
            raise
    
    # Helper methods
    
    async def _db_record_to_model(self, record: Dict[str, Any]) -> CommunityVibeRecipe:
        """Convert database record to Pydantic model."""
        # Convert JSON fields back to proper models
        if record.get("ingredients"):
            from app.models.cocktail import RecipeIngredient
            record["ingredients"] = [RecipeIngredient(**ing) for ing in record["ingredients"]]
        
        if record.get("meta"):
            from app.models.cocktail import RecipeMeta
            record["meta"] = [RecipeMeta(**meta) for meta in record["meta"]]
        
        if record.get("details"):
            from app.models.cocktail import RecipeDetail
            record["details"] = [RecipeDetail(**detail) for detail in record["details"]]
        
        return CommunityVibeRecipe(**record)
    
    async def _apply_advanced_filters(self, recipes: List[Dict], filters: Optional[CommunityVibeRecipeFilters]) -> List[Dict]:
        """Apply filters that can't be done at database level."""
        if not filters:
            return recipes
        
        filtered = recipes
        
        # Search filter
        if filters.search:
            search_lower = filters.search.lower()
            filtered = [
                r for r in filtered 
                if search_lower in r.get("name", "").lower() or 
                   search_lower in r.get("description", "").lower()
            ]
        
        # Rating filter
        if filters.min_rating:
            filtered = [
                r for r in filtered 
                if r.get("rating_average") and r["rating_average"] >= filters.min_rating
            ]
        
        # Prep time filters
        if filters.min_prep_time:
            filtered = [
                r for r in filtered 
                if r.get("prep_time_minutes") and r["prep_time_minutes"] >= filters.min_prep_time
            ]
        
        if filters.max_prep_time:
            filtered = [
                r for r in filtered 
                if r.get("prep_time_minutes") and r["prep_time_minutes"] <= filters.max_prep_time
            ]
        
        # Tags filter
        if filters.tags:
            filtered = [
                r for r in filtered 
                if r.get("tags") and any(tag in r["tags"] for tag in filters.tags)
            ]
        
        return filtered
    
    async def _increment_view_count(self, recipe_id: UUID) -> None:
        """Increment the view count for a recipe."""
        try:
            recipe = await self.db.get_record(self.table_name, str(recipe_id))
            if recipe:
                current_views = recipe.get("view_count", 0)
                await self.db.update_record(
                    self.table_name, 
                    str(recipe_id), 
                    {"view_count": current_views + 1}
                )
        except Exception as e:
            logger.warning(f"Failed to increment view count for recipe {recipe_id}: {str(e)}")
    
    async def _update_recipe_rating_stats(self, recipe_id: UUID) -> None:
        """Update recipe rating statistics after a new rating."""
        try:
            # Get all ratings for this recipe
            ratings = await self.db.get_records(
                self.ratings_table, 
                {"recipe_id": str(recipe_id)}
            )
            
            if ratings:
                total_rating = sum(r["rating"] for r in ratings)
                avg_rating = total_rating / len(ratings)
                
                await self.db.update_record(
                    self.table_name,
                    str(recipe_id),
                    {
                        "rating_average": round(avg_rating, 2),
                        "rating_count": len(ratings)
                    }
                )
        except Exception as e:
            logger.warning(f"Failed to update rating stats for recipe {recipe_id}: {str(e)}")
    
    def _extract_difficulty(self, meta_text: str) -> Optional[str]:
        """Extract difficulty level from meta text."""
        text_lower = meta_text.lower()
        if "easy" in text_lower:
            return "Easy"
        elif "medium" in text_lower or "moderate" in text_lower:
            return "Medium"
        elif "hard" in text_lower or "difficult" in text_lower:
            return "Hard"
        elif "expert" in text_lower:
            return "Expert"
        return None
    
    def _extract_prep_time(self, meta_text: str) -> Optional[int]:
        """Extract prep time in minutes from meta text."""
        import re
        # Look for numbers followed by time units
        time_match = re.search(r'(\d+)\s*(minute|min|hour|hr)', meta_text.lower())
        if time_match:
            value = int(time_match.group(1))
            unit = time_match.group(2)
            if "hour" in unit or "hr" in unit:
                return value * 60
            return value
        return None
    
    def _extract_servings(self, meta_text: str) -> Optional[int]:
        """Extract number of servings from meta text."""
        import re
        # Look for numbers followed by serving indicators
        serving_match = re.search(r'(\d+)\s*(serving|portion|drink)', meta_text.lower())
        if serving_match:
            return int(serving_match.group(1))
        return None

# Global service instance
def get_community_vibes_service() -> CommunityVibesService:
    """Get the Community Vibes service instance."""
    return CommunityVibesService()

community_vibes_service = get_community_vibes_service() 