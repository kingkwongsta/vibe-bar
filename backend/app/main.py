# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, UTC
import logging
import uvicorn
import time

# Import models and services
from app.models import APIResponse, HealthCheck, UserPreferences, CocktailRecipe
from app.services import get_openrouter_service, get_cocktail_service, OpenRouterError
from app.config import config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Vibe Bar API - AI Cocktail Recipe Generator",
    description="AI-Powered Cocktail Recipe Generation using OpenRouter LLM",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
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
        message="Welcome to Vibe Bar - AI Cocktail Recipe Generator",
        data={
            "api_name": "Vibe Bar Cocktail Recipe Generator",
            "version": "2.0.0",
            "description": "AI-Powered Cocktail Recipe Generation using OpenRouter LLM",
            "docs_url": "/docs",
            "features": [
                "Generate custom cocktail recipes based on user preferences",
                "Support for various base spirits and flavor profiles",
                "Personalized recipes based on vibes and dietary restrictions"
            ]
        }
    )

# Health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now(UTC),
        service="vibe-bar-cocktail-api",
        version="2.0.0"
    )

# Test endpoint for frontend connectivity
@app.get("/api/test", response_model=APIResponse)
async def test_endpoint():
    """Test endpoint to verify frontend can reach backend"""
    return APIResponse(
        message="Backend is reachable and ready for cocktail recipe generation!",
        data={
            "timestamp": datetime.now(UTC).isoformat(),
            "cors_working": True,
            "cocktail_service_available": True,
            "ai_service_available": config.validate_openrouter_config()
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
# COCKTAIL RECIPE GENERATION ENDPOINT
# =============================================================================

@app.post("/api/cocktails/generate", response_model=APIResponse)
async def generate_cocktail_recipe(
    preferences: UserPreferences = Body(
        ...,
        example={
            "ingredients": ["vodka"],
            "customIngredients": "",
            "flavors": ["sweet"],
            "vibe": "date night",
            "specialRequests": "no eggs",
            "model": "anthropic/claude-3-haiku"
        }
    ),
    cocktail_service = Depends(get_cocktail_service)
):
    """Generate a cocktail recipe based on user preferences"""
    try:
        logger.info(f"Generating cocktail recipe for preferences: {preferences}")
        
        recipe = await cocktail_service.generate_cocktail_recipe(preferences)
        
        return APIResponse(
            message="Cocktail recipe generated successfully",
            data=recipe.model_dump()
        )
        
    except OpenRouterError as e:
        logger.error(f"OpenRouter error in cocktail generation: {e}")
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in cocktail generation: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

if __name__ == "__main__":
    # Use configuration for server settings
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=config.is_development()
    ) 