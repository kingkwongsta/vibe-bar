# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, UTC

# Import our configuration
from app.config import config

# Import our models
from app.models import (
    VibeCreate, VibeResponse, VibeCategory, VibeIntensity,
    MoodCreate, MoodResponse, MoodType, EmotionalState,
    APIResponse, HealthCheck
)

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
            "phase": "4 - OpenRouter Integration (In Progress)"
        }
    )

# Health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Enhanced health check endpoint using Pydantic models"""
    return HealthCheck(
        service="vibe-bar-api",
        version="0.1.0",
        dependencies={
            "pydantic": True,
            "fastapi": True,
            "openrouter_configured": config.validate_openrouter_config(),
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
            "models_loaded": True
        }
    )

# Example vibe endpoints (will be expanded in future phases)
@app.post("/api/vibes", response_model=APIResponse)
async def create_vibe_example(vibe: VibeCreate):
    """Example endpoint for creating a vibe - demonstrates model validation"""
    # This is just a mock response for now
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
    
    return APIResponse(
        message="Vibe created successfully (mock)",
        data=mock_vibe.model_dump()
    )

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

# Example mood endpoints (will be expanded in future phases)
@app.post("/api/moods", response_model=APIResponse)
async def create_mood_example(mood: MoodCreate):
    """Example endpoint for creating a mood entry - demonstrates model validation"""
    # This is just a mock response for now
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
    
    return APIResponse(
        message="Mood entry created successfully (mock)",
        data=mock_mood.model_dump()
    )

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