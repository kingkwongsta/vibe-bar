"""
Simple Cocktail Recipe Generation Service using OpenRouter LLM
"""

import json
import logging
from typing import Optional

from app.services.openrouter import OpenRouterService, get_openrouter_service, AIMessage
from app.models.cocktail import UserPreferences, CocktailRecipe, RecipeMeta, RecipeIngredient, RecipeDetail

logger = logging.getLogger(__name__)


class CocktailRecipeService:
    """Simple service for AI-powered cocktail recipe generation"""
    
    def __init__(self, ai_service: Optional[OpenRouterService] = None):
        self.ai_service = ai_service or get_openrouter_service()
        
    async def generate_cocktail_recipe(self, preferences: UserPreferences) -> CocktailRecipe:
        """Generate a cocktail recipe based on user preferences"""
        try:
            logger.info(f"Generating cocktail recipe for preferences: {preferences}")
            
            # Create the prompt
            system_prompt = """You are a master mixologist creating cocktail recipes. 
You must respond with ONLY a valid JSON object in this exact format:

{
  "recipeTitle": "Recipe Name",
  "recipeDescription": "Brief description of the cocktail",
  "recipeMeta": [
    {"text": "X min prep"},
    {"text": "Easy/Medium/Hard"},
    {"text": "X serving(s)"}
  ],
  "recipeIngredients": [
    {"name": "Ingredient Name", "amount": "X oz"}
  ],
  "recipeInstructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "recipeDetails": [
    {"title": "Recommended Glassware", "content": "Glass type"},
    {"title": "Perfect Garnish", "content": "Garnish description"}
  ]
}

Create a creative, delicious cocktail recipe."""

            # Build user prompt from preferences
            user_prompt = "Create a cocktail recipe with these preferences:\n"
            
            if preferences.ingredients:
                user_prompt += f"Base ingredients: {', '.join(preferences.ingredients)}\n"
            if preferences.customIngredients:
                user_prompt += f"Additional ingredients: {preferences.customIngredients}\n"
            if preferences.flavors:
                user_prompt += f"Flavor profiles: {', '.join(preferences.flavors)}\n"
            if preferences.vibe:
                user_prompt += f"Vibe: {preferences.vibe}\n"
            if preferences.specialRequests:
                user_prompt += f"Special requests: {preferences.specialRequests}\n"
                
            if not any([preferences.ingredients, preferences.flavors, preferences.vibe]):
                user_prompt += "Create a creative and delicious cocktail recipe.\n"
                
            user_prompt += "\nRespond with ONLY the JSON object, no markdown or extra text."
            
            # Log the prompt being sent to LLM for debugging
            logger.info(f"Sending prompt to LLM: {user_prompt}")
            
            messages = [
                AIMessage(role="system", content=system_prompt),
                AIMessage(role="user", content=user_prompt)
            ]
            
            # Call AI service
            ai_response = await self.ai_service.complete(
                messages=messages,
                temperature=0.8,
                max_tokens=1000,
            )
            
            # Parse response - remove any markdown formatting
            content = ai_response.content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.startswith('```'):
                content = content[3:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
            
            # Parse JSON and create recipe
            recipe_data = json.loads(content)
            
            return CocktailRecipe(
                recipeTitle=recipe_data["recipeTitle"],
                recipeDescription=recipe_data["recipeDescription"],
                recipeMeta=[RecipeMeta(text=meta["text"]) for meta in recipe_data["recipeMeta"]],
                recipeIngredients=[RecipeIngredient(name=ing["name"], amount=ing["amount"]) for ing in recipe_data["recipeIngredients"]],
                recipeInstructions=recipe_data["recipeInstructions"],
                recipeDetails=[RecipeDetail(title=detail["title"], content=detail["content"]) for detail in recipe_data["recipeDetails"]]
            )
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            logger.error(f"AI response: {ai_response.content}")
            raise ValueError("AI returned invalid JSON response")
        except Exception as e:
            logger.error(f"Error generating cocktail recipe: {e}")
            raise


# Global service instance
cocktail_service: Optional[CocktailRecipeService] = None

def get_cocktail_service() -> CocktailRecipeService:
    """Get or create the cocktail recipe service instance"""
    global cocktail_service
    
    if cocktail_service is None:
        cocktail_service = CocktailRecipeService()
    
    return cocktail_service 