"""
Drink Recipe Generation Service using OpenRouter LLM
Specialized service for generating creative drink recipes based on user preferences and mood.
"""

import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, UTC
import uuid

from app.services.openrouter import OpenRouterService, get_openrouter_service, AIMessage, AIResponse
from app.models.drink import (
    DrinkRecipe, DrinkRecipeResponse, DrinkGenerationRequest, DrinkCustomizationRequest,
    DrinkRecommendationRequest, DrinkFeedback, Ingredient, DrinkType, FlavorProfile,
    Difficulty, MoodCategory
)

logger = logging.getLogger(__name__)


class DrinkRecipeService:
    """Service for AI-powered drink recipe generation and management"""
    
    def __init__(self, ai_service: Optional[OpenRouterService] = None):
        self.ai_service = ai_service or get_openrouter_service()
        
    def _create_drink_generation_prompt(self, request: DrinkGenerationRequest) -> List[AIMessage]:
        """Create a structured prompt for drink recipe generation"""
        
        system_prompt = """You are an expert mixologist and beverage creator with extensive knowledge of:
- Classic and modern cocktails, mocktails, and beverages
- Flavor combinations and pairing principles
- Ingredient properties and substitutions
- Seasonal and mood-based drink preferences
- Preparation techniques and presentation

Your task is to create detailed, creative drink recipes based on user preferences. 
Always respond with a valid JSON object following this EXACT structure:

{
  "name": "Creative Drink Name",
  "description": "Engaging description of the drink's flavor profile and appeal",
  "drink_type": "cocktail|mocktail|coffee|tea|smoothie|juice|hot_chocolate|kombucha",
  "flavor_profiles": ["sweet", "fruity", "refreshing"],
  "ingredients": [
    {
      "name": "Ingredient Name",
      "amount": "2 oz",
      "type": "spirit|mixer|garnish|base",
      "optional": false,
      "notes": "Optional preparation notes"
    }
  ],
  "instructions": [
    "Step 1: Detailed instruction",
    "Step 2: Another step",
    "Step 3: Final step"
  ],
  "prep_time_minutes": 5,
  "difficulty": "easy|medium|hard",
  "servings": 1,
  "garnish": "Garnish description",
  "glassware": "Recommended glass type",
  "tags": ["tag1", "tag2", "tag3"],
  "ai_explanation": "Why this recipe fits the user's request",
  "alternative_suggestions": ["Alternative 1", "Alternative 2"],
  "pairing_suggestions": ["Food pairing 1", "Food pairing 2"]
}

Be creative and consider the user's mood, preferences, and constraints. Focus on quality ingredients and balanced flavors."""

        # Build user request
        user_parts = []
        
        if request.mood:
            user_parts.append(f"Mood: {request.mood.value}")
            
        if request.drink_type:
            user_parts.append(f"Drink type: {request.drink_type.value}")
            
        if request.flavor_preferences:
            flavors = [f.value for f in request.flavor_preferences]
            user_parts.append(f"Preferred flavors: {', '.join(flavors)}")
            
        if request.avoid_flavors:
            avoid = [f.value for f in request.avoid_flavors]
            user_parts.append(f"Avoid flavors: {', '.join(avoid)}")
            
        if request.available_ingredients:
            user_parts.append(f"Available ingredients: {', '.join(request.available_ingredients)}")
            
        if request.dietary_restrictions:
            user_parts.append(f"Dietary restrictions: {', '.join(request.dietary_restrictions)}")
            
        if request.difficulty_preference:
            user_parts.append(f"Difficulty preference: {request.difficulty_preference.value}")
            
        if request.occasion:
            user_parts.append(f"Occasion: {request.occasion}")
            
        if request.time_of_day:
            user_parts.append(f"Time of day: {request.time_of_day}")
            
        if request.temperature_preference:
            user_parts.append(f"Temperature preference: {request.temperature_preference}")
            
        if request.custom_request:
            user_parts.append(f"Special request: {request.custom_request}")
        
        user_prompt = "Please create a drink recipe with the following preferences:\n\n" + "\n".join(user_parts)
        
        if not user_parts:
            user_prompt = "Please create a creative and delicious drink recipe for me."
        
        user_prompt += "\n\nRespond with ONLY the JSON object, no additional text."
        
        return [
            AIMessage(role="system", content=system_prompt),
            AIMessage(role="user", content=user_prompt)
        ]
    
    async def generate_drink_recipe(self, request: DrinkGenerationRequest) -> DrinkRecipeResponse:
        """Generate a new drink recipe based on user preferences"""
        try:
            logger.info(f"Generating drink recipe for mood: {request.mood}, type: {request.drink_type}")
            
            # Create structured prompt
            messages = self._create_drink_generation_prompt(request)
            
            # Call AI service
            ai_response = await self.ai_service.complete(
                messages=messages,
                temperature=0.8,  # Higher creativity for recipe generation
                max_tokens=1500,  # Enough for detailed recipe
            )
            
            # Parse JSON response
            try:
                recipe_data = json.loads(ai_response.content)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response as JSON: {e}")
                logger.error(f"AI response: {ai_response.content}")
                raise ValueError("AI returned invalid JSON response")
            
            # Create ingredient objects
            ingredients = []
            for ing_data in recipe_data.get('ingredients', []):
                ingredients.append(Ingredient(**ing_data))
            
            # Create drink recipe
            recipe = DrinkRecipe(
                id=str(uuid.uuid4()),
                name=recipe_data['name'],
                description=recipe_data['description'],
                drink_type=DrinkType(recipe_data['drink_type']),
                flavor_profiles=[FlavorProfile(fp) for fp in recipe_data['flavor_profiles']],
                ingredients=ingredients,
                instructions=recipe_data['instructions'],
                prep_time_minutes=recipe_data['prep_time_minutes'],
                difficulty=Difficulty(recipe_data['difficulty']),
                servings=recipe_data.get('servings', 1),
                garnish=recipe_data.get('garnish'),
                glassware=recipe_data.get('glassware'),
                tags=recipe_data.get('tags', []),
                generated_by_ai=True,
                source_prompt=f"Mood: {request.mood}, Type: {request.drink_type}",
                mood_inspiration=request.mood,
                created_at=datetime.now(UTC)
            )
            
            return DrinkRecipeResponse(
                recipe=recipe,
                ai_explanation=recipe_data.get('ai_explanation'),
                alternative_suggestions=recipe_data.get('alternative_suggestions', []),
                pairing_suggestions=recipe_data.get('pairing_suggestions', [])
            )
            
        except Exception as e:
            logger.error(f"Error generating drink recipe: {e}")
            raise
    
    async def customize_drink_recipe(
        self, 
        request: DrinkCustomizationRequest,
        base_recipe: DrinkRecipe
    ) -> DrinkRecipeResponse:
        """Customize an existing drink recipe based on user modifications"""
        
        system_prompt = """You are an expert mixologist helping to customize a drink recipe.
You will receive a base recipe and modifications requested by the user.
Create a new version of the recipe incorporating the requested changes while maintaining balance and flavor harmony.

Respond with a valid JSON object following the same structure as the original recipe."""
        
        user_prompt = f"""
Please customize this drink recipe:

BASE RECIPE:
{base_recipe.model_dump_json(indent=2)}

REQUESTED MODIFICATIONS:
{json.dumps(request.modifications, indent=2)}

REASON: {request.reason or "User customization"}

Create a modified version that incorporates these changes while maintaining good flavor balance.
Respond with ONLY the JSON object, no additional text.
"""
        
        messages = [
            AIMessage(role="system", content=system_prompt),
            AIMessage(role="user", content=user_prompt)
        ]
        
        ai_response = await self.ai_service.complete(
            messages=messages,
            temperature=0.7,
            max_tokens=1500
        )
        
        # Parse and create customized recipe
        try:
            recipe_data = json.loads(ai_response.content)
            
            # Create new recipe with modifications
            ingredients = [Ingredient(**ing_data) for ing_data in recipe_data.get('ingredients', [])]
            
            customized_recipe = DrinkRecipe(
                id=str(uuid.uuid4()),
                name=recipe_data['name'],
                description=recipe_data['description'],
                drink_type=DrinkType(recipe_data['drink_type']),
                flavor_profiles=[FlavorProfile(fp) for fp in recipe_data['flavor_profiles']],
                ingredients=ingredients,
                instructions=recipe_data['instructions'],
                prep_time_minutes=recipe_data['prep_time_minutes'],
                difficulty=Difficulty(recipe_data['difficulty']),
                servings=recipe_data.get('servings', 1),
                garnish=recipe_data.get('garnish'),
                glassware=recipe_data.get('glassware'),
                tags=recipe_data.get('tags', []),
                generated_by_ai=True,
                source_prompt=f"Customization of {base_recipe.name}",
                created_at=datetime.now(UTC)
            )
            
            return DrinkRecipeResponse(
                recipe=customized_recipe,
                ai_explanation=recipe_data.get('ai_explanation', "Customized version of the original recipe"),
                alternative_suggestions=recipe_data.get('alternative_suggestions', []),
                pairing_suggestions=recipe_data.get('pairing_suggestions', [])
            )
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse customization response: {e}")
            raise ValueError("AI returned invalid JSON response for customization")
    
    async def get_drink_recommendations(
        self, 
        request: DrinkRecommendationRequest
    ) -> List[DrinkRecipeResponse]:
        """Get personalized drink recommendations based on user history and preferences"""
        
        system_prompt = """You are a personalized drink recommendation expert.
Based on user history, preferences, and patterns, recommend 3 different drink recipes.
Each recommendation should be unique and cater to different aspects of their preferences.

Respond with a JSON array of 3 recipe objects, each following the standard recipe structure."""
        
        user_parts = []
        
        if request.preferred_flavors:
            flavors = [f.value for f in request.preferred_flavors]
            user_parts.append(f"Preferred flavors: {', '.join(flavors)}")
            
        if request.mood_pattern:
            user_parts.append(f"Mood pattern: {request.mood_pattern}")
            
        if request.time_constraints:
            user_parts.append(f"Available time: {request.time_constraints} minutes")
            
        if request.skill_level:
            user_parts.append(f"Skill level: {request.skill_level.value}")
            
        if request.user_history:
            user_parts.append(f"Previously tried: {len(request.user_history)} recipes")
        
        user_prompt = f"""
Please recommend 3 diverse drink recipes based on:

{chr(10).join(user_parts)}

Create recommendations that:
1. Match the user's preferences
2. Offer variety in flavors and types
3. Consider their constraints and skill level

Respond with a JSON array of 3 recipe objects, no additional text.
"""
        
        messages = [
            AIMessage(role="system", content=system_prompt),
            AIMessage(role="user", content=user_prompt)
        ]
        
        ai_response = await self.ai_service.complete(
            messages=messages,
            temperature=0.8,
            max_tokens=2000
        )
        
        try:
            recipes_data = json.loads(ai_response.content)
            recommendations = []
            
            for recipe_data in recipes_data:
                ingredients = [Ingredient(**ing_data) for ing_data in recipe_data.get('ingredients', [])]
                
                recipe = DrinkRecipe(
                    id=str(uuid.uuid4()),
                    name=recipe_data['name'],
                    description=recipe_data['description'],
                    drink_type=DrinkType(recipe_data['drink_type']),
                    flavor_profiles=[FlavorProfile(fp) for fp in recipe_data['flavor_profiles']],
                    ingredients=ingredients,
                    instructions=recipe_data['instructions'],
                    prep_time_minutes=recipe_data['prep_time_minutes'],
                    difficulty=Difficulty(recipe_data['difficulty']),
                    servings=recipe_data.get('servings', 1),
                    garnish=recipe_data.get('garnish'),
                    glassware=recipe_data.get('glassware'),
                    tags=recipe_data.get('tags', []),
                    generated_by_ai=True,
                    source_prompt="Personalized recommendation",
                    created_at=datetime.now(UTC)
                )
                
                recommendations.append(DrinkRecipeResponse(
                    recipe=recipe,
                    ai_explanation=recipe_data.get('ai_explanation', "Personalized recommendation"),
                    alternative_suggestions=recipe_data.get('alternative_suggestions', []),
                    pairing_suggestions=recipe_data.get('pairing_suggestions', [])
                ))
            
            return recommendations
            
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Failed to parse recommendations response: {e}")
            raise ValueError("AI returned invalid JSON response for recommendations")
    
    async def analyze_drink_pairing(self, recipe: DrinkRecipe, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze and suggest food pairings for a drink recipe"""
        
        system_prompt = """You are a food and beverage pairing expert.
Analyze the given drink recipe and suggest food pairings based on flavor profiles, occasion, and context.
Provide detailed explanations for why each pairing works."""
        
        user_prompt = f"""
Analyze this drink recipe and suggest food pairings:

DRINK: {recipe.name}
DESCRIPTION: {recipe.description}
FLAVORS: {', '.join([fp.value for fp in recipe.flavor_profiles])}
TYPE: {recipe.drink_type.value}
INGREDIENTS: {', '.join([ing.name for ing in recipe.ingredients])}

CONTEXT: {json.dumps(context, indent=2)}

Provide pairing suggestions with explanations in JSON format:
{{
  "appetizer_pairings": [{{ "food": "Food Name", "explanation": "Why it pairs well" }}],
  "main_course_pairings": [{{ "food": "Food Name", "explanation": "Why it pairs well" }}],
  "dessert_pairings": [{{ "food": "Food Name", "explanation": "Why it pairs well" }}],
  "general_principles": ["Principle 1", "Principle 2"],
  "occasion_notes": "Notes about when to serve this combination"
}}
"""
        
        messages = [
            AIMessage(role="system", content=system_prompt),
            AIMessage(role="user", content=user_prompt)
        ]
        
        ai_response = await self.ai_service.complete(
            messages=messages,
            temperature=0.6,
            max_tokens=1000
        )
        
        try:
            return json.loads(ai_response.content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse pairing analysis: {e}")
            return {"error": "Failed to analyze pairings"}


# Global service instance
drink_service: Optional[DrinkRecipeService] = None

def get_drink_service() -> DrinkRecipeService:
    """Get or create the drink recipe service instance"""
    global drink_service
    
    if drink_service is None:
        drink_service = DrinkRecipeService()
    
    return drink_service 