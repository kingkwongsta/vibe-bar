"""
Simple cocktail recipe models for Vibe Bar application
"""

from typing import List, Optional
from pydantic import BaseModel


class UserPreferences(BaseModel):
    """Request model matching frontend input data structure"""
    ingredients: List[str] = []
    customIngredients: Optional[str] = None
    flavors: List[str] = []
    strength: Optional[str] = None
    vibe: Optional[str] = None
    specialRequests: Optional[str] = None


class RecipeMeta(BaseModel):
    """Recipe metadata for prep time, difficulty, servings"""
    text: str


class RecipeIngredient(BaseModel):
    """Recipe ingredient with name and amount"""
    name: str
    amount: str


class RecipeDetail(BaseModel):
    """Recipe details like glassware and garnish"""
    title: str
    content: str


class CocktailRecipe(BaseModel):
    """Output model matching frontend recipe view"""
    recipeTitle: str
    recipeDescription: str
    recipeMeta: List[RecipeMeta]  # [prep time, difficulty, servings]
    recipeIngredients: List[RecipeIngredient]
    recipeInstructions: List[str]
    recipeDetails: List[RecipeDetail]  # [glassware, garnish] 