"""
Community Vibes recipe models for storing user-generated recipes in Supabase.
These models represent the "Community Vibes" - recipes created and shared by users.
"""

from datetime import datetime, UTC
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from uuid import UUID, uuid4

from .cocktail import RecipeIngredient, RecipeMeta, RecipeDetail


class CommunityVibeRecipeCreate(BaseModel):
    """Model for creating a new Community Vibe recipe"""
    name: str = Field(..., min_length=1, max_length=100, description="Recipe name")
    description: str = Field(..., min_length=1, max_length=500, description="Recipe description")
    ingredients: List[RecipeIngredient] = Field(..., min_items=1, description="List of ingredients")
    instructions: List[str] = Field(..., min_items=1, description="Step-by-step instructions")
    meta: List[RecipeMeta] = Field(default_factory=list, description="Recipe metadata (prep time, difficulty, servings)")
    details: List[RecipeDetail] = Field(default_factory=list, description="Recipe details (glassware, garnish)")
    
    # Optional fields
    creator_name: Optional[str] = Field(None, max_length=50, description="Name of recipe creator")
    creator_email: Optional[str] = Field(None, description="Email of recipe creator")
    tags: List[str] = Field(default_factory=list, description="Recipe tags/categories")
    flavor_profile: List[str] = Field(default_factory=list, description="Flavor characteristics")
    vibe: Optional[str] = Field(None, max_length=100, description="Vibe/mood of the recipe")
    difficulty_level: Optional[str] = Field(None, description="Difficulty level")
    prep_time_minutes: Optional[int] = Field(None, ge=1, le=1440, description="Prep time in minutes")
    servings: Optional[int] = Field(None, ge=1, le=20, description="Number of servings")
    
    # User preferences that led to this recipe
    original_preferences: Optional[Dict[str, Any]] = Field(None, description="Original user preferences used to generate recipe")
    ai_model_used: Optional[str] = Field(None, description="AI model used to generate recipe")
    
    @field_validator('difficulty_level')
    @classmethod
    def validate_difficulty_level(cls, v):
        if v and v not in ['Easy', 'Medium', 'Hard', 'Expert']:
            raise ValueError('difficulty_level must be one of: Easy, Medium, Hard, Expert')
        return v
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if len(v) > 10:
            raise ValueError('Maximum 10 tags allowed')
        return v


class CommunityVibeRecipeUpdate(BaseModel):
    """Model for updating an existing Community Vibe recipe"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Recipe name")
    description: Optional[str] = Field(None, min_length=1, max_length=500, description="Recipe description")
    ingredients: Optional[List[RecipeIngredient]] = Field(None, min_items=1, description="List of ingredients")
    instructions: Optional[List[str]] = Field(None, min_items=1, description="Step-by-step instructions")
    meta: Optional[List[RecipeMeta]] = Field(None, description="Recipe metadata")
    details: Optional[List[RecipeDetail]] = Field(None, description="Recipe details")
    
    tags: Optional[List[str]] = Field(None, description="Recipe tags/categories")
    flavor_profile: Optional[List[str]] = Field(None, description="Flavor characteristics")
    vibe: Optional[str] = Field(None, max_length=100, description="Vibe/mood of the recipe")
    difficulty_level: Optional[str] = Field(None, description="Difficulty level")
    prep_time_minutes: Optional[int] = Field(None, ge=1, le=1440, description="Prep time in minutes")
    servings: Optional[int] = Field(None, ge=1, le=20, description="Number of servings")
    
    @field_validator('difficulty_level')
    @classmethod
    def validate_difficulty_level(cls, v):
        if v and v not in ['Easy', 'Medium', 'Hard', 'Expert']:
            raise ValueError('difficulty_level must be one of: Easy, Medium, Hard, Expert')
        return v


class CommunityVibeRecipe(BaseModel):
    """Complete Community Vibe recipe model with database fields"""
    # Database fields
    id: UUID = Field(default_factory=uuid4, description="Unique recipe identifier")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), description="Creation timestamp")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), description="Last update timestamp")
    
    # Core recipe data
    name: str = Field(..., description="Recipe name")
    description: str = Field(..., description="Recipe description")
    ingredients: List[RecipeIngredient] = Field(..., description="List of ingredients")
    instructions: List[str] = Field(..., description="Step-by-step instructions")
    meta: List[RecipeMeta] = Field(default_factory=list, description="Recipe metadata")
    details: List[RecipeDetail] = Field(default_factory=list, description="Recipe details")
    
    # Creator information
    creator_name: Optional[str] = Field(None, description="Name of recipe creator")
    creator_email: Optional[str] = Field(None, description="Email of recipe creator")
    
    # Recipe characteristics
    tags: List[str] = Field(default_factory=list, description="Recipe tags/categories")
    flavor_profile: List[str] = Field(default_factory=list, description="Flavor characteristics")
    vibe: Optional[str] = Field(None, description="Vibe/mood of the recipe")
    difficulty_level: Optional[str] = Field(None, description="Difficulty level")
    prep_time_minutes: Optional[int] = Field(None, description="Prep time in minutes")
    servings: Optional[int] = Field(None, description="Number of servings")
    
    # AI generation metadata
    original_preferences: Optional[Dict[str, Any]] = Field(None, description="Original user preferences")
    ai_model_used: Optional[str] = Field(None, description="AI model used to generate recipe")
    
    # Community metrics
    rating_average: Optional[float] = Field(None, ge=0, le=5, description="Average user rating")
    rating_count: int = Field(default=0, ge=0, description="Number of ratings")
    view_count: int = Field(default=0, ge=0, description="Number of views")
    favorite_count: int = Field(default=0, ge=0, description="Number of favorites")
    
    # Status and moderation
    is_public: bool = Field(default=True, description="Whether recipe is publicly visible")
    is_featured: bool = Field(default=False, description="Whether recipe is featured")
    is_approved: bool = Field(default=True, description="Whether recipe is approved for public viewing")


class CommunityVibeRecipeResponse(BaseModel):
    """Response model for Community Vibe recipe API endpoints"""
    recipe: CommunityVibeRecipe
    can_edit: bool = Field(default=False, description="Whether current user can edit this recipe")
    can_delete: bool = Field(default=False, description="Whether current user can delete this recipe")
    is_favorited: bool = Field(default=False, description="Whether current user has favorited this recipe")


class CommunityVibeRecipeList(BaseModel):
    """Response model for paginated Community Vibe recipe lists"""
    recipes: List[CommunityVibeRecipe]
    total_count: int = Field(..., ge=0, description="Total number of recipes")
    page: int = Field(..., ge=1, description="Current page number")
    per_page: int = Field(..., ge=1, description="Items per page")
    total_pages: int = Field(..., ge=1, description="Total number of pages")


class CommunityVibeRecipeFilters(BaseModel):
    """Filtering options for Community Vibe recipes"""
    search: Optional[str] = Field(None, min_length=1, max_length=100, description="Search in recipe name/description")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    difficulty_level: Optional[str] = Field(None, description="Filter by difficulty level")
    min_rating: Optional[float] = Field(None, ge=0, le=5, description="Minimum average rating")
    creator_name: Optional[str] = Field(None, description="Filter by creator name")
    vibe: Optional[str] = Field(None, description="Filter by vibe")
    is_featured: Optional[bool] = Field(None, description="Filter featured recipes")
    min_prep_time: Optional[int] = Field(None, ge=1, description="Minimum prep time in minutes")
    max_prep_time: Optional[int] = Field(None, ge=1, description="Maximum prep time in minutes")
    
    @field_validator('difficulty_level')
    @classmethod
    def validate_difficulty_level(cls, v):
        if v and v not in ['Easy', 'Medium', 'Hard', 'Expert']:
            raise ValueError('difficulty_level must be one of: Easy, Medium, Hard, Expert')
        return v


class RecipeRating(BaseModel):
    """Model for rating a Community Vibe recipe"""
    recipe_id: UUID = Field(..., description="Recipe being rated")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    review: Optional[str] = Field(None, max_length=500, description="Optional review text")
    reviewer_name: Optional[str] = Field(None, max_length=50, description="Name of reviewer")
    reviewer_email: Optional[str] = Field(None, description="Email of reviewer")


class RecipeStats(BaseModel):
    """Statistics for Community Vibes recipes"""
    total_recipes: int = Field(..., ge=0, description="Total number of recipes")
    total_creators: int = Field(..., ge=0, description="Total number of unique creators")
    average_rating: Optional[float] = Field(None, ge=0, le=5, description="Overall average rating")
    most_popular_tags: List[str] = Field(default_factory=list, description="Most frequently used tags")
    featured_recipes_count: int = Field(..., ge=0, description="Number of featured recipes") 