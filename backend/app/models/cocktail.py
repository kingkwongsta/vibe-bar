"""
Simple cocktail recipe models for Vibe Bar application
"""

from typing import List, Optional
from pydantic import BaseModel


class UserPreferences(BaseModel):
    """Input model matching frontend user preferences"""
    baseSpirits: List[str] = []
    flavorProfiles: List[str] = []
    defaultStrength: str = "medium"
    dietaryRestrictions: List[str] = []
    defaultVibe: str = ""
    preferredVibes: List[str] = []


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