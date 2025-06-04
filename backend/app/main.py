# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, UTC
from typing import Dict, Any, List, Optional
import logging
import asyncio
import uvicorn

# Import models and services
from app.models import (
    APIResponse, HealthCheck, DrinkGenerationRequest, DrinkRecipeResponse,
    DrinkCustomizationRequest, DrinkRecommendationRequest, DrinkFeedback,
    DrinkType, FlavorProfile, MoodCategory, Difficulty
)
from app.services import get_openrouter_service, get_drink_service, OpenRouterError
from app.config import config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Vibe Bar API - Drink Recipe Generator",
    description="AI-Powered Drink Recipe Generation using OpenRouter LLM",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware using configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/", response_model=APIResponse)
async def root():
    """Root endpoint returning API information"""
    return APIResponse(
        message="Welcome to Vibe Bar - AI Drink Recipe Generator",
        data={
            "api_name": "Vibe Bar Drink Recipe Generator",
            "version": "2.0.0",
            "description": "AI-Powered Drink Recipe Generation using OpenRouter LLM",
            "docs_url": "/docs",
            "features": [
                "Generate custom drink recipes based on mood and preferences",
                "Customize existing recipes",
                "Get personalized recommendations",
                "Food pairing suggestions",
                "Multiple drink types: cocktails, mocktails, coffee, tea, smoothies"
            ]
        }
    )

# Enhanced health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now(UTC),
        service="vibe-bar-drink-api",
        version="2.0.0"
    )

# Configuration endpoint for debugging (development only)
@app.get("/api/config", response_model=APIResponse)
async def get_config_status():
    """Get configuration status (development only)"""
    if not config.is_development():
        return APIResponse(
            message="Configuration endpoint only available in development",
            data={}
        )
    
    return APIResponse(
        message="Configuration status",
        data={
            "environment": config.ENVIRONMENT,
            "openrouter_configured": config.validate_openrouter_config(),
            "default_ai_model": config.DEFAULT_AI_MODEL,
            "fallback_ai_model": config.FALLBACK_AI_MODEL,
            "ai_settings": {
                "timeout": config.AI_TIMEOUT,
                "max_retries": config.AI_MAX_RETRIES,
                "temperature": config.AI_TEMPERATURE,
                "max_tokens": config.AI_MAX_TOKENS
            }
        }
    )

# Test endpoint for frontend connectivity
@app.get("/api/test", response_model=APIResponse)
async def test_endpoint():
    """Test endpoint to verify frontend can reach backend"""
    return APIResponse(
        message="Backend is reachable and focused on drink recipe generation!",
        data={
            "timestamp": datetime.now(UTC).isoformat(),
            "cors_working": True,
            "drink_service_available": True,
            "ai_service_available": config.validate_openrouter_config(),
            "supported_drink_types": [dt.value for dt in DrinkType],
            "supported_moods": [mood.value for mood in MoodCategory]
        }
    )

# OpenRouter AI health check
@app.get("/api/ai/health", response_model=APIResponse)
async def ai_health_check():
    """Check the health of the AI service"""
    try:
        ai_service = get_openrouter_service()
        health_status = await ai_service.health_check()
        return APIResponse(
            message="AI service health check completed",
            data=health_status
        )
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {str(e)}")

# =============================================================================
# DRINK RECIPE GENERATION ENDPOINTS
# =============================================================================

@app.post("/api/drinks/generate", response_model=APIResponse)
async def generate_drink_recipe(
    request: DrinkGenerationRequest,
    drink_service = Depends(get_drink_service)
):
    """Generate a new drink recipe based on user preferences and mood"""
    try:
        logger.info(f"Generating drink recipe for mood: {request.mood}, type: {request.drink_type}")
        
        recipe_response = await drink_service.generate_drink_recipe(request)
        
        return APIResponse(
            message="Drink recipe generated successfully",
            data={
                "recipe": recipe_response.recipe.model_dump(),
                "ai_explanation": recipe_response.ai_explanation,
                "alternative_suggestions": recipe_response.alternative_suggestions,
                "pairing_suggestions": recipe_response.pairing_suggestions
            }
        )
        
    except OpenRouterError as e:
        logger.error(f"OpenRouter error in drink generation: {e}")
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in drink generation: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/api/drinks/customize", response_model=APIResponse)
async def customize_drink_recipe(
    request: DrinkCustomizationRequest,
    drink_service = Depends(get_drink_service)
):
    """Customize an existing drink recipe"""
    try:
        # Note: In a real app, you'd fetch the base recipe from a database
        # For now, this is a placeholder - you'd need to implement recipe storage
        raise HTTPException(
            status_code=501, 
            detail="Recipe customization requires a database to store base recipes. This will be implemented when adding persistence."
        )
        
    except Exception as e:
        logger.error(f"Error in drink customization: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/api/drinks/recommendations", response_model=APIResponse)
async def get_drink_recommendations(
    request: DrinkRecommendationRequest,
    drink_service = Depends(get_drink_service)
):
    """Get personalized drink recommendations"""
    try:
        logger.info(f"Getting drink recommendations for user preferences")
        
        recommendations = await drink_service.get_drink_recommendations(request)
        
        return APIResponse(
            message=f"Generated {len(recommendations)} drink recommendations",
            data={
                "recommendations": [
                    {
                        "recipe": rec.recipe.model_dump(),
                        "ai_explanation": rec.ai_explanation,
                        "alternative_suggestions": rec.alternative_suggestions,
                        "pairing_suggestions": rec.pairing_suggestions
                    }
                    for rec in recommendations
                ]
            }
        )
        
    except OpenRouterError as e:
        logger.error(f"OpenRouter error in recommendations: {e}")
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# =============================================================================
# HELPER ENDPOINTS FOR FRONTEND
# =============================================================================

@app.get("/api/drinks/options", response_model=APIResponse)
async def get_drink_options():
    """Get available options for drink generation (types, flavors, moods, etc.)"""
    return APIResponse(
        message="Drink generation options retrieved",
        data={
            "drink_types": {
                "options": [{"value": dt.value, "label": dt.value.replace('_', ' ').title()} for dt in DrinkType],
                "description": "Types of drinks that can be generated"
            },
            "flavor_profiles": {
                "options": [{"value": fp.value, "label": fp.value.title()} for fp in FlavorProfile],
                "description": "Flavor profiles to choose from"
            },
            "mood_categories": {
                "options": [{"value": mood.value, "label": mood.value.title()} for mood in MoodCategory],
                "description": "Mood categories that influence drink recommendations"
            },
            "difficulty_levels": {
                "options": [{"value": diff.value, "label": diff.value.title()} for diff in Difficulty],
                "description": "Difficulty levels for drink preparation"
            },
            "time_of_day_options": [
                "morning", "afternoon", "evening", "night", "late night"
            ],
            "temperature_preferences": [
                "hot", "cold", "room temperature"
            ]
        }
    )

@app.post("/api/drinks/quick-generate", response_model=APIResponse)
async def quick_generate_drink(
    request: Dict[str, Any] = Body(
        openapi_examples={
            "energizing_morning": {
                "summary": "Energizing morning drink",
                "description": "Generate an energizing drink for morning",
                "value": {
                    "mood": "energizing",
                    "time_of_day": "morning",
                    "custom_request": "I need something to wake me up and start my day right"
                }
            },
            "relaxing_evening": {
                "summary": "Relaxing evening drink",
                "description": "Generate a relaxing drink for evening",
                "value": {
                    "mood": "relaxing",
                    "time_of_day": "evening",
                    "drink_type": "tea",
                    "custom_request": "Help me unwind after a long day"
                }
            },
            "celebratory_cocktail": {
                "summary": "Celebratory cocktail",
                "description": "Generate a festive cocktail for celebration",
                "value": {
                    "mood": "celebratory",
                    "drink_type": "cocktail",
                    "flavor_preferences": ["fruity", "sweet"],
                    "custom_request": "Something special for a celebration"
                }
            }
        }
    ),
    drink_service = Depends(get_drink_service)
):
    """Quick drink generation with simplified input"""
    try:
        # Convert dict to DrinkGenerationRequest
        generation_request = DrinkGenerationRequest(**request)
        
        recipe_response = await drink_service.generate_drink_recipe(generation_request)
        
        return APIResponse(
            message="Quick drink recipe generated successfully",
            data={
                "recipe": recipe_response.recipe.model_dump(),
                "ai_explanation": recipe_response.ai_explanation,
                "alternative_suggestions": recipe_response.alternative_suggestions
            }
        )
        
    except OpenRouterError as e:
        logger.error(f"OpenRouter error in quick generation: {e}")
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in quick generation: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

if __name__ == "__main__":
    # Use configuration for server settings
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=config.is_development()
    ) 