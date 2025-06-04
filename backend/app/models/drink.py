"""
Drink recipe models for Vibe Bar application
"""

from datetime import datetime, UTC
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class DrinkType(str, Enum):
    """Types of drinks that can be generated"""
    COCKTAIL = "cocktail"
    MOCKTAIL = "mocktail"
    COFFEE = "coffee"
    TEA = "tea"
    SMOOTHIE = "smoothie"
    JUICE = "juice"
    HOT_CHOCOLATE = "hot_chocolate"
    KOMBUCHA = "kombucha"


class FlavorProfile(str, Enum):
    """Flavor profiles for drinks"""
    SWEET = "sweet"
    SOUR = "sour"
    BITTER = "bitter"
    SPICY = "spicy"
    FRUITY = "fruity"
    HERBAL = "herbal"
    CREAMY = "creamy"
    REFRESHING = "refreshing"
    TROPICAL = "tropical"
    CITRUSY = "citrusy"
    EARTHY = "earthy"
    FLORAL = "floral"


class Difficulty(str, Enum):
    """Difficulty levels for drink preparation"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class MoodCategory(str, Enum):
    """Mood categories that influence drink recommendations"""
    ENERGIZING = "energizing"
    RELAXING = "relaxing"
    CELEBRATORY = "celebratory"
    COMFORTING = "comforting"
    REFRESHING = "refreshing"
    ROMANTIC = "romantic"
    FOCUS = "focus"
    SOCIAL = "social"


class Ingredient(BaseModel):
    """Individual ingredient in a drink recipe"""
    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    amount: str = Field(..., min_length=1, max_length=50, description="Amount/quantity (e.g., '2 oz', '1 cup')")
    type: Optional[str] = Field(None, max_length=50, description="Type of ingredient (spirit, mixer, garnish, etc.)")
    optional: bool = Field(default=False, description="Whether this ingredient is optional")
    notes: Optional[str] = Field(None, max_length=200, description="Special notes about this ingredient")


class DrinkRecipeBase(BaseModel):
    """Base model for drink recipes"""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the drink")
    description: str = Field(..., min_length=10, max_length=500, description="Description of the drink")
    drink_type: DrinkType = Field(..., description="Type of drink")
    flavor_profiles: List[FlavorProfile] = Field(..., min_items=1, max_items=5, description="Flavor profiles")
    ingredients: List[Ingredient] = Field(..., min_items=1, description="List of ingredients")
    instructions: List[str] = Field(..., min_items=1, description="Step-by-step preparation instructions")
    prep_time_minutes: int = Field(..., ge=1, le=120, description="Preparation time in minutes")
    difficulty: Difficulty = Field(..., description="Difficulty level")
    servings: int = Field(default=1, ge=1, le=10, description="Number of servings")
    garnish: Optional[str] = Field(None, max_length=100, description="Garnish instructions")
    glassware: Optional[str] = Field(None, max_length=50, description="Recommended glassware")
    tags: List[str] = Field(default_factory=list, max_items=10, description="Tags for categorization")


class DrinkRecipeCreate(DrinkRecipeBase):
    """Model for creating a new drink recipe"""
    pass


class DrinkRecipe(DrinkRecipeBase):
    """Full drink recipe model with metadata"""
    id: Optional[str] = Field(None, description="Unique identifier")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    generated_by_ai: bool = Field(default=True, description="Whether this recipe was AI-generated")
    source_prompt: Optional[str] = Field(None, description="Original prompt used to generate this recipe")
    mood_inspiration: Optional[MoodCategory] = Field(None, description="Mood that inspired this recipe")
    rating: Optional[float] = Field(None, ge=0.0, le=5.0, description="User rating (0-5 stars)")
    notes: Optional[str] = Field(None, max_length=1000, description="Additional notes")


class DrinkRecipeResponse(BaseModel):
    """Response model for drink recipe API calls"""
    recipe: DrinkRecipe
    ai_explanation: Optional[str] = Field(None, description="AI explanation of the recipe choice")
    alternative_suggestions: List[str] = Field(default_factory=list, description="Alternative drink suggestions")
    pairing_suggestions: List[str] = Field(default_factory=list, description="Food pairing suggestions")


class DrinkGenerationRequest(BaseModel):
    """Request model for generating drink recipes"""
    mood: Optional[MoodCategory] = Field(None, description="Current mood or desired mood")
    drink_type: Optional[DrinkType] = Field(None, description="Preferred drink type")
    flavor_preferences: List[FlavorProfile] = Field(default_factory=list, max_items=5, description="Preferred flavors")
    avoid_flavors: List[FlavorProfile] = Field(default_factory=list, max_items=5, description="Flavors to avoid")
    available_ingredients: List[str] = Field(default_factory=list, description="Ingredients user has available")
    dietary_restrictions: List[str] = Field(default_factory=list, description="Dietary restrictions or preferences")
    difficulty_preference: Optional[Difficulty] = Field(None, description="Preferred difficulty level")
    occasion: Optional[str] = Field(None, max_length=100, description="Special occasion or context")
    time_of_day: Optional[str] = Field(None, max_length=20, description="Time of day (morning, afternoon, evening)")
    temperature_preference: Optional[str] = Field(None, description="Hot, cold, or room temperature")
    custom_request: Optional[str] = Field(None, max_length=500, description="Free-form custom request")
    
    @field_validator('time_of_day')
    @classmethod
    def validate_time_of_day(cls, v):
        if v and v.lower() not in ['morning', 'afternoon', 'evening', 'night', 'late night']:
            raise ValueError('time_of_day must be morning, afternoon, evening, night, or late night')
        return v.lower() if v else v


class DrinkCustomizationRequest(BaseModel):
    """Request model for customizing existing drink recipes"""
    base_recipe_id: str = Field(..., description="ID of the base recipe to customize")
    modifications: Dict[str, Any] = Field(..., description="Modifications to apply")
    reason: Optional[str] = Field(None, max_length=200, description="Reason for customization")


class DrinkFeedback(BaseModel):
    """Model for user feedback on drink recipes"""
    recipe_id: str = Field(..., description="ID of the recipe being rated")
    rating: float = Field(..., ge=0.0, le=5.0, description="Rating from 0-5 stars")
    taste_rating: Optional[float] = Field(None, ge=0.0, le=5.0, description="Taste rating")
    difficulty_rating: Optional[float] = Field(None, ge=0.0, le=5.0, description="Actual difficulty experienced")
    comments: Optional[str] = Field(None, max_length=1000, description="User comments")
    would_make_again: Optional[bool] = Field(None, description="Whether user would make this again")
    modifications_made: Optional[str] = Field(None, max_length=500, description="Any modifications user made")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class DrinkRecommendationRequest(BaseModel):
    """Request model for getting drink recommendations based on history/preferences"""
    user_history: Optional[List[str]] = Field(None, description="Previous drink recipe IDs user has tried")
    preferred_flavors: List[FlavorProfile] = Field(default_factory=list, description="User's preferred flavors")
    mood_pattern: Optional[str] = Field(None, description="User's typical mood pattern")
    time_constraints: Optional[int] = Field(None, ge=1, le=120, description="Available time in minutes")
    skill_level: Optional[Difficulty] = Field(None, description="User's skill level") 