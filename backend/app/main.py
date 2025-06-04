# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, UTC
from typing import Dict, Any, List, Optional, Union
import logging
import asyncio
import uvicorn

# Import models and services
from app.models import (
    APIResponse, HealthCheck
)
from app.services.openrouter import OpenRouterService, OpenRouterError, get_openrouter_service
from app.config import config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Vibe Bar API",
    description="Backend API for Vibe Bar - AI-Powered Assistant",
    version="1.0.0",
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
        message="Welcome to Vibe Bar API",
        data={
            "api_name": "Vibe Bar",
            "version": "1.0.0",
            "description": "AI-Powered Assistant API",
            "docs_url": "/docs"
        }
    )

# Enhanced health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now(UTC),
        service="vibe-bar-api",
        version="1.0.0"
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
async def ai_health_check(ai_service: OpenRouterService = Depends(get_openrouter_service)):
    """Check the health of the AI service"""
    try:
        health_status = await ai_service.health_check()
        return APIResponse(
            message="AI service health check completed",
            data=health_status
        )
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {str(e)}")

@app.get("/api/ai/models", response_model=APIResponse)
async def get_available_models(ai_service: OpenRouterService = Depends(get_openrouter_service)):
    """Get list of available AI models"""
    try:
        models = await ai_service.get_available_models()
        return APIResponse(
            message="Available models retrieved",
            data={"models": models}
        )
    except Exception as e:
        logger.error(f"Failed to get models: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to retrieve models: {str(e)}")

@app.post("/api/ai/complete", response_model=APIResponse)
async def ai_complete(
    request: Dict[str, Any] = Body(
        examples={
            "simple_message": {
                "summary": "Simple text message",
                "description": "Basic AI completion with a simple text prompt",
                "value": {
                    "messages": "Hello! Tell me something uplifting and motivational.",
                    "temperature": 0.7,
                    "max_tokens": 150
                }
            },
            "structured_conversation": {
                "summary": "Structured conversation with system prompt",
                "description": "Multi-message conversation with system and user roles",
                "value": {
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful AI assistant."
                        },
                        {
                            "role": "user",
                            "content": "Can you help me brainstorm ideas for a creative project?"
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 250
                }
            },
            "advice_request": {
                "summary": "General advice request",
                "description": "Ask AI for practical advice or recommendations",
                "value": {
                    "messages": "I'm looking for some productivity tips to help me stay focused while working from home. What would you recommend?",
                    "temperature": 0.5,
                    "max_tokens": 200
                }
            }
        }
    ),
    ai_service: OpenRouterService = Depends(get_openrouter_service)
):
    """General AI completion endpoint with example requests"""
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

if __name__ == "__main__":
    # Use configuration for server settings
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=config.is_development()
    ) 