# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, UTC
from typing import Dict, Any, Optional
import logging

# Import our configuration
from app.config import config

# Import our models
from app.models import (
    VibeCreate, VibeResponse, VibeCategory, VibeIntensity,
    MoodCreate, MoodResponse, MoodType, EmotionalState,
    APIResponse, HealthCheck
)

# Import OpenRouter service
from app.services import OpenRouterService
from app.services.openrouter import get_openrouter_service, OpenRouterError, AIResponse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Vibe Bar API",
    description="Backend API for Vibe Bar - AI-Powered Mood & Vibe Tracking",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware using configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3000",
        config.FRONTEND_URL       # Production URL from env
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Dependency to get OpenRouter service
async def get_ai_service() -> OpenRouterService:
    """Dependency to get the OpenRouter service"""
    try:
        return get_openrouter_service()
    except Exception as e:
        logger.error(f"Failed to initialize OpenRouter service: {e}")
        raise HTTPException(
            status_code=503,
            detail="AI service is currently unavailable"
        )

# Root endpoint
@app.get("/", response_model=APIResponse)
async def root():
    """API root endpoint"""
    return APIResponse(
        message="Welcome to Vibe Bar API",
        data={
            "version": "0.1.0",
            "status": "running",
            "environment": config.ENVIRONMENT,
            "docs": "/docs",
            "phase": "4 - OpenRouter Integration (Active)"
        }
    )

# Enhanced health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Enhanced health check endpoint with OpenRouter status"""
    # Test OpenRouter service if configured
    openrouter_status = {"configured": False, "healthy": False}
    
    if config.validate_openrouter_config():
        try:
            ai_service = get_openrouter_service()
            openrouter_health = await ai_service.health_check()
            openrouter_status = {
                "configured": True,
                "healthy": openrouter_health["status"] == "healthy",
                "default_model": openrouter_health.get("default_model"),
                "response_time": openrouter_health.get("response_time")
            }
        except Exception as e:
            logger.warning(f"OpenRouter health check failed: {e}")
            openrouter_status = {"configured": True, "healthy": False, "error": str(e)}
    
    return HealthCheck(
        service="vibe-bar-api",
        version="0.1.0",
        dependencies={
            "pydantic": True,
            "fastapi": True,
            "openrouter_configured": config.validate_openrouter_config(),
            "openrouter_healthy": openrouter_status["healthy"],
            "environment": config.ENVIRONMENT
        }
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
        message="Backend is reachable from frontend!",
        data={
            "timestamp": datetime.now(UTC).isoformat(),
            "cors_working": True,
            "models_loaded": True,
            "ai_service_available": config.validate_openrouter_config()
        }
    )

# OpenRouter AI endpoints
@app.get("/api/ai/health", response_model=APIResponse)
async def ai_health_check(ai_service: OpenRouterService = Depends(get_ai_service)):
    """Check the health of the AI service"""
    try:
        health_status = await ai_service.health_check()
        return APIResponse(
            message="AI service health check completed",
            data=health_status
        )
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unhealthy: {str(e)}")

@app.get("/api/ai/models", response_model=APIResponse)
async def get_available_models(ai_service: OpenRouterService = Depends(get_ai_service)):
    """Get list of available AI models"""
    try:
        models = await ai_service.get_available_models()
        return APIResponse(
            message="Available models retrieved",
            data={
                "models": models,
                "default_model": ai_service.default_model,
                "fallback_model": ai_service.fallback_model
            }
        )
    except Exception as e:
        logger.error(f"Failed to get models: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to retrieve models: {str(e)}")

@app.post("/api/ai/complete", response_model=APIResponse)
async def ai_complete(
    request: Dict[str, Any],
    ai_service: OpenRouterService = Depends(get_ai_service)
):
    """General AI completion endpoint"""
    try:
        # Extract parameters from request
        messages = request.get("messages", "")
        model = request.get("model")
        temperature = request.get("temperature")
        max_tokens = request.get("max_tokens")
        
        if not messages:
            raise HTTPException(status_code=400, detail="Messages are required")
        
        response = await ai_service.complete(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return APIResponse(
            message="AI completion successful",
            data={
                "response": response.content,
                "model_used": response.model_used,
                "tokens_used": response.tokens_used,
                "response_time": response.response_time,
                "created_at": response.created_at.isoformat()
            }
        )
        
    except OpenRouterError as e:
        logger.error(f"OpenRouter error: {e}")
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in AI completion: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# Enhanced vibe endpoints with AI integration
@app.post("/api/vibes", response_model=APIResponse)
async def create_vibe_example(
    vibe: VibeCreate,
    ai_service: OpenRouterService = Depends(get_ai_service)
):
    """Create a vibe with AI analysis"""
    try:
        # Create the vibe response (mock for now)
        mock_vibe = VibeResponse(
            id=1,
            title=vibe.title,
            description=vibe.description,
            category=vibe.category,
            intensity=vibe.intensity,
            mood_score=vibe.mood_score,
            tags=vibe.tags,
            created_at=datetime.now(UTC)
        )
        
        # Get AI analysis of the vibe
        ai_analysis = None
        try:
            ai_response = await ai_service.analyze_vibe(
                vibe_title=vibe.title,
                vibe_description=vibe.description
            )
            ai_analysis = {
                "insights": ai_response.content,
                "model_used": ai_response.model_used,
                "response_time": ai_response.response_time
            }
        except Exception as e:
            logger.warning(f"AI analysis failed for vibe: {e}")
            ai_analysis = {"error": "AI analysis unavailable"}
        
        return APIResponse(
            message="Vibe created successfully with AI insights",
            data={
                "vibe": mock_vibe.model_dump(),
                "ai_analysis": ai_analysis
            }
        )
        
    except Exception as e:
        logger.error(f"Error creating vibe: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create vibe: {str(e)}")

@app.post("/api/vibes/{vibe_id}/analyze", response_model=APIResponse)
async def analyze_existing_vibe(
    vibe_id: int,
    request: Dict[str, Any],
    ai_service: OpenRouterService = Depends(get_ai_service)
):
    """Analyze an existing vibe with AI"""
    try:
        vibe_title = request.get("title", "")
        vibe_description = request.get("description")
        user_context = request.get("context", {})
        
        if not vibe_title:
            raise HTTPException(status_code=400, detail="Vibe title is required")
        
        ai_response = await ai_service.analyze_vibe(
            vibe_title=vibe_title,
            vibe_description=vibe_description,
            user_context=user_context
        )
        
        return APIResponse(
            message="Vibe analysis completed",
            data={
                "vibe_id": vibe_id,
                "analysis": ai_response.content,
                "model_used": ai_response.model_used,
                "tokens_used": ai_response.tokens_used,
                "response_time": ai_response.response_time
            }
        )
        
    except OpenRouterError as e:
        logger.error(f"AI analysis error: {e}")
        raise HTTPException(status_code=503, detail=f"AI analysis failed: {str(e)}")
    except Exception as e:
        logger.error(f"Error analyzing vibe: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/vibes/categories", response_model=APIResponse)
async def get_vibe_categories():
    """Get available vibe categories"""
    return APIResponse(
        message="Vibe categories retrieved",
        data={
            "categories": [category.value for category in VibeCategory],
            "intensities": [intensity.value for intensity in VibeIntensity]
        }
    )

# Enhanced mood endpoints with AI integration
@app.post("/api/moods", response_model=APIResponse)
async def create_mood_example(
    mood: MoodCreate,
    ai_service: OpenRouterService = Depends(get_ai_service)
):
    """Create a mood entry with AI insights"""
    try:
        # Create the mood response (mock for now)
        mock_mood = MoodResponse(
            id=1,
            primary_mood=mood.primary_mood,
            secondary_moods=mood.secondary_moods,
            emotional_state=mood.emotional_state,
            energy_level=mood.energy_level,
            stress_level=mood.stress_level,
            notes=mood.notes,
            created_at=datetime.now(UTC)
        )
        
        # Get AI insights about the mood
        ai_insights = None
        try:
            mood_data = {
                "primary_mood": mood.primary_mood.value,
                "energy_level": mood.energy_level,
                "stress_level": mood.stress_level,
                "notes": mood.notes
            }
            
            ai_response = await ai_service.generate_mood_insights(mood_data)
            ai_insights = {
                "insights": ai_response.content,
                "model_used": ai_response.model_used,
                "response_time": ai_response.response_time
            }
        except Exception as e:
            logger.warning(f"AI insights failed for mood: {e}")
            ai_insights = {"error": "AI insights unavailable"}
        
        return APIResponse(
            message="Mood entry created successfully with AI insights",
            data={
                "mood": mock_mood.model_dump(),
                "ai_insights": ai_insights
            }
        )
        
    except Exception as e:
        logger.error(f"Error creating mood: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create mood: {str(e)}")

@app.post("/api/moods/{mood_id}/insights", response_model=APIResponse)
async def generate_mood_insights(
    mood_id: int,
    request: Dict[str, Any],
    ai_service: OpenRouterService = Depends(get_ai_service)
):
    """Generate AI insights for a mood entry"""
    try:
        mood_data = request.get("mood_data", {})
        historical_data = request.get("historical_data", [])
        
        if not mood_data:
            raise HTTPException(status_code=400, detail="Mood data is required")
        
        ai_response = await ai_service.generate_mood_insights(
            mood_data=mood_data,
            historical_data=historical_data if historical_data else None
        )
        
        return APIResponse(
            message="Mood insights generated",
            data={
                "mood_id": mood_id,
                "insights": ai_response.content,
                "model_used": ai_response.model_used,
                "tokens_used": ai_response.tokens_used,
                "response_time": ai_response.response_time
            }
        )
        
    except OpenRouterError as e:
        logger.error(f"AI insights error: {e}")
        raise HTTPException(status_code=503, detail=f"AI insights failed: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating insights: {e}")
        raise HTTPException(status_code=500, detail=f"Insights generation failed: {str(e)}")

@app.get("/api/moods/types", response_model=APIResponse)
async def get_mood_types():
    """Get available mood types and emotional states"""
    return APIResponse(
        message="Mood types retrieved",
        data={
            "mood_types": [mood_type.value for mood_type in MoodType],
            "emotional_states": [state.value for state in EmotionalState]
        }
    )

if __name__ == "__main__":
    import uvicorn
    # Use configuration for server settings
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=config.is_development()
    ) 