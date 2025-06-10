"""
Community Vibes API router.
Handles all endpoints for Community Vibes recipes - user-generated cocktail recipes.
"""

import logging
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Query, Body, status
from fastapi.responses import JSONResponse

from app.models import (
    APIResponse,
    CommunityVibeRecipe,
    CommunityVibeRecipeCreate,
    CommunityVibeRecipeUpdate,
    CommunityVibeRecipeResponse,
    CommunityVibeRecipeList,
    CommunityVibeRecipeFilters,
    RecipeRating,
    RecipeStats,
    UserPreferences,
    CocktailRecipe
)
from app.services import get_community_vibes_service, get_cocktail_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/community-vibes",
    tags=["Community Vibes"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get Community Vibes service
def get_community_service():
    return get_community_vibes_service()

# =============================================================================
# RECIPE CRUD ENDPOINTS
# =============================================================================

@router.post("/recipes", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe_data: CommunityVibeRecipeCreate = Body(
        ...,
        example={
            "name": "Sunset Margarita",
            "description": "A beautiful layered margarita perfect for summer evenings",
            "ingredients": [
                {"name": "Tequila Blanco", "amount": "2 oz"},
                {"name": "Triple Sec", "amount": "1 oz"},
                {"name": "Fresh Lime Juice", "amount": "1 oz"},
                {"name": "Grenadine", "amount": "0.5 oz"}
            ],
            "instructions": [
                "Rim glass with salt",
                "Shake tequila, triple sec, and lime juice with ice",
                "Strain into glass over ice",
                "Slowly pour grenadine to create sunset effect"
            ],
            "creator_name": "John Doe",
            "creator_email": "john@example.com",
            "tags": ["margarita", "summer", "colorful"],
            "flavor_profile": ["citrus", "sweet", "tangy"],
            "vibe": "Summer Sunset",
            "difficulty_level": "Medium",
            "prep_time_minutes": 5,
            "servings": 1
        }
    ),
    community_service = Depends(get_community_service)
):
    """Create a new Community Vibe recipe."""
    try:
        recipe = await community_service.create_recipe(recipe_data)
        
        return APIResponse(
            message="Community Vibe recipe created successfully",
            data={
                "recipe_id": str(recipe.id),
                "name": recipe.name,
                "creator": recipe.creator_name,
                "created_at": recipe.created_at.isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to create Community Vibe recipe: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create recipe: {str(e)}"
        )

@router.get("/recipes", response_model=APIResponse)
async def get_recipes(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, min_length=1, max_length=100, description="Search term"),
    tags: Optional[str] = Query(None, description="Comma-separated tags to filter by"),
    difficulty_level: Optional[str] = Query(None, description="Filter by difficulty level"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    creator_name: Optional[str] = Query(None, description="Filter by creator name"),
    vibe: Optional[str] = Query(None, description="Filter by vibe"),
    is_featured: Optional[bool] = Query(None, description="Filter featured recipes"),
    sort_by: Optional[str] = Query("created_at", description="Sort field"),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    community_service = Depends(get_community_service)
):
    """Get a paginated list of Community Vibe recipes with filtering options."""
    try:
        # Build filters
        filters = CommunityVibeRecipeFilters()
        if search:
            filters.search = search
        if tags:
            filters.tags = [tag.strip() for tag in tags.split(",")]
        if difficulty_level:
            filters.difficulty_level = difficulty_level
        if min_rating is not None:
            filters.min_rating = min_rating
        if creator_name:
            filters.creator_name = creator_name
        if vibe:
            filters.vibe = vibe
        if is_featured is not None:
            filters.is_featured = is_featured
        
        recipes = await community_service.get_recipes(filters, page, per_page)
        
        return APIResponse(
            message="Community Vibe recipes retrieved successfully",
            data=recipes.model_dump()
        )
        
    except Exception as e:
        logger.error(f"Failed to get Community Vibe recipes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recipes: {str(e)}"
        )

@router.get("/recipes/{recipe_id}", response_model=APIResponse)
async def get_recipe(
    recipe_id: UUID,
    community_service = Depends(get_community_service)
):
    """Get a specific Community Vibe recipe by ID."""
    try:
        recipe = await community_service.get_recipe(recipe_id)
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        return APIResponse(
            message="Recipe retrieved successfully",
            data=recipe.model_dump()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get recipe {recipe_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recipe: {str(e)}"
        )

@router.put("/recipes/{recipe_id}", response_model=APIResponse)
async def update_recipe(
    recipe_id: UUID,
    update_data: CommunityVibeRecipeUpdate,
    community_service = Depends(get_community_service)
):
    """Update a Community Vibe recipe."""
    try:
        # Check if recipe exists
        existing_recipe = await community_service.get_recipe(recipe_id)
        if not existing_recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Update recipe
        updated_recipe = await community_service.update_recipe(recipe_id, update_data)
        
        if not updated_recipe:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update recipe"
            )
        
        return APIResponse(
            message="Recipe updated successfully",
            data={
                "recipe_id": str(updated_recipe.id),
                "name": updated_recipe.name,
                "updated_at": updated_recipe.updated_at.isoformat()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update recipe {recipe_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update recipe: {str(e)}"
        )

@router.delete("/recipes/{recipe_id}", response_model=APIResponse)
async def delete_recipe(
    recipe_id: UUID,
    community_service = Depends(get_community_service)
):
    """Delete a Community Vibe recipe."""
    try:
        # Check if recipe exists
        existing_recipe = await community_service.get_recipe(recipe_id)
        if not existing_recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Delete recipe
        success = await community_service.delete_recipe(recipe_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete recipe"
            )
        
        return APIResponse(
            message="Recipe deleted successfully",
            data={"recipe_id": str(recipe_id)}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete recipe {recipe_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete recipe: {str(e)}"
        )

# =============================================================================
# AI RECIPE CONVERSION ENDPOINTS
# =============================================================================

@router.post("/recipes/from-ai", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def save_ai_recipe_as_community_vibe(
    ai_recipe: CocktailRecipe = Body(..., description="AI-generated cocktail recipe"),
    user_preferences: UserPreferences = Body(..., description="User preferences used to generate recipe"),
    creator_name: Optional[str] = Body(None, description="Name of the creator"),
    creator_email: Optional[str] = Body(None, description="Email of the creator"),
    community_service = Depends(get_community_service)
):
    """Save an AI-generated cocktail recipe as a Community Vibe recipe."""
    try:
        recipe = await community_service.create_recipe_from_ai_generation(
            ai_recipe=ai_recipe,
            user_preferences=user_preferences,
            creator_name=creator_name,
            creator_email=creator_email
        )
        
        return APIResponse(
            message="AI-generated recipe saved as Community Vibe successfully",
            data={
                "recipe_id": str(recipe.id),
                "name": recipe.name,
                "original_ai_title": ai_recipe.recipeTitle,
                "creator": recipe.creator_name,
                "vibe": recipe.vibe,
                "ai_model_used": recipe.ai_model_used,
                "created_at": recipe.created_at.isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to save AI recipe as Community Vibe: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save AI recipe: {str(e)}"
        )

@router.post("/recipes/generate-and-save", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def generate_and_save_recipe(
    user_preferences: UserPreferences = Body(..., description="User preferences for recipe generation"),
    creator_name: Optional[str] = Body(None, description="Name of the creator"),
    creator_email: Optional[str] = Body(None, description="Email of the creator"),
    community_service = Depends(get_community_service),
    cocktail_service = Depends(get_cocktail_service)
):
    """Generate an AI cocktail recipe and immediately save it as a Community Vibe."""
    try:
        # Generate AI recipe
        ai_recipe = await cocktail_service.generate_cocktail_recipe(user_preferences)
        
        # Save as Community Vibe
        recipe = await community_service.create_recipe_from_ai_generation(
            ai_recipe=ai_recipe,
            user_preferences=user_preferences,
            creator_name=creator_name,
            creator_email=creator_email
        )
        
        return APIResponse(
            message="Recipe generated and saved as Community Vibe successfully",
            data={
                "recipe_id": str(recipe.id),
                "name": recipe.name,
                "creator": recipe.creator_name,
                "vibe": recipe.vibe,
                "ai_model_used": recipe.ai_model_used,
                "generated_recipe": ai_recipe.model_dump(),
                "created_at": recipe.created_at.isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to generate and save recipe: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate and save recipe: {str(e)}"
        )

# =============================================================================
# RATING AND FEEDBACK ENDPOINTS
# =============================================================================

@router.post("/recipes/{recipe_id}/rate", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def rate_recipe(
    recipe_id: UUID,
    rating_data: RecipeRating = Body(
        ...,
        example={
            "rating": 5,
            "review": "Amazing recipe! Perfect balance of flavors.",
            "reviewer_name": "Jane Smith",
            "reviewer_email": "jane@example.com"
        }
    ),
    community_service = Depends(get_community_service)
):
    """Rate a Community Vibe recipe."""
    try:
        # Check if recipe exists
        recipe = await community_service.get_recipe(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Set recipe_id in rating data
        rating_data.recipe_id = recipe_id
        
        # Submit rating
        success = await community_service.rate_recipe(rating_data)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to submit rating"
            )
        
        return APIResponse(
            message="Rating submitted successfully",
            data={
                "recipe_id": str(recipe_id),
                "rating": rating_data.rating,
                "reviewer": rating_data.reviewer_name
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to rate recipe {recipe_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit rating: {str(e)}"
        )

# =============================================================================
# SEARCH AND DISCOVERY ENDPOINTS
# =============================================================================

@router.get("/recipes/search", response_model=APIResponse)
async def search_recipes(
    q: str = Query(..., min_length=1, max_length=100, description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Maximum number of results"),
    community_service = Depends(get_community_service)
):
    """Search Community Vibe recipes by name and description."""
    try:
        recipes = await community_service.search_recipes(q, limit)
        
        return APIResponse(
            message=f"Found {len(recipes)} recipes matching '{q}'",
            data={
                "search_query": q,
                "total_results": len(recipes),
                "recipes": [recipe.model_dump() for recipe in recipes]
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to search recipes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search recipes: {str(e)}"
        )

@router.get("/recipes/featured", response_model=APIResponse)
async def get_featured_recipes(
    limit: int = Query(10, ge=1, le=50, description="Number of featured recipes to return"),
    community_service = Depends(get_community_service)
):
    """Get featured Community Vibe recipes."""
    try:
        filters = CommunityVibeRecipeFilters(is_featured=True)
        recipes = await community_service.get_recipes(filters, page=1, per_page=limit)
        
        return APIResponse(
            message="Featured recipes retrieved successfully",
            data={
                "total_featured": recipes.total_count,
                "recipes": [recipe.model_dump() for recipe in recipes.recipes]
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to get featured recipes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get featured recipes: {str(e)}"
        )

@router.get("/recipes/by-creator/{creator_name}", response_model=APIResponse)
async def get_recipes_by_creator(
    creator_name: str,
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    community_service = Depends(get_community_service)
):
    """Get recipes by a specific creator."""
    try:
        filters = CommunityVibeRecipeFilters(creator_name=creator_name)
        recipes = await community_service.get_recipes(filters, page, per_page)
        
        return APIResponse(
            message=f"Recipes by {creator_name} retrieved successfully",
            data={
                "creator_name": creator_name,
                "pagination": {
                    "page": recipes.page,
                    "per_page": recipes.per_page,
                    "total_count": recipes.total_count,
                    "total_pages": recipes.total_pages
                },
                "recipes": [recipe.model_dump() for recipe in recipes.recipes]
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to get recipes by creator {creator_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recipes by creator: {str(e)}"
        )

# =============================================================================
# COMMUNITY STATISTICS ENDPOINTS
# =============================================================================

@router.get("/stats", response_model=APIResponse)
async def get_community_statistics(
    community_service = Depends(get_community_service)
):
    """Get Community Vibes statistics and metrics."""
    try:
        stats = await community_service.get_community_stats()
        
        return APIResponse(
            message="Community statistics retrieved successfully",
            data=stats.model_dump()
        )
        
    except Exception as e:
        logger.error(f"Failed to get community statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get community statistics: {str(e)}"
        )

@router.get("/tags", response_model=APIResponse)
async def get_popular_tags(
    limit: int = Query(20, ge=1, le=50, description="Number of popular tags to return"),
    community_service = Depends(get_community_service)
):
    """Get most popular tags used in Community Vibe recipes."""
    try:
        stats = await community_service.get_community_stats()
        popular_tags = stats.most_popular_tags[:limit]
        
        return APIResponse(
            message="Popular tags retrieved successfully",
            data={
                "total_tags": len(stats.most_popular_tags),
                "popular_tags": popular_tags
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to get popular tags: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get popular tags: {str(e)}"
        )

# =============================================================================
# HEALTH AND INFO ENDPOINTS
# =============================================================================

@router.get("/health", response_model=APIResponse)
async def community_vibes_health_check(
    community_service = Depends(get_community_service)
):
    """Health check for Community Vibes service."""
    try:
        # Test basic functionality
        stats = await community_service.get_community_stats()
        
        return APIResponse(
            message="Community Vibes service is healthy",
            data={
                "status": "healthy",
                "total_recipes": stats.total_recipes,
                "total_creators": stats.total_creators,
                "service_available": True
            }
        )
        
    except Exception as e:
        logger.error(f"Community Vibes health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Community Vibes service unhealthy: {str(e)}"
        ) 