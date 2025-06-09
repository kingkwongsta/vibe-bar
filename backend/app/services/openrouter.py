"""
OpenRouter API service for LLM interactions.
Handles AI model calls with retry logic and fallback models.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, UTC
import httpx
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
import time

from app.config import config

# Set up logging
logger = logging.getLogger(__name__)

class AIMessage(BaseModel):
    """Structured AI message for conversations"""
    role: str = Field(..., description="Message role: system, user, or assistant")
    content: str = Field(..., description="Message content")

class AIResponse(BaseModel):
    """Structured AI response"""
    content: str = Field(..., description="AI response content")
    model_used: str = Field(..., description="Model that generated the response")
    tokens_used: Optional[int] = Field(None, description="Tokens consumed")
    finish_reason: Optional[str] = Field(None, description="Why the generation stopped")
    response_time: float = Field(..., description="Response time in seconds")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class OpenRouterError(Exception):
    """Custom exception for OpenRouter-related errors"""
    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code

class OpenRouterService:
    """Service for interacting with OpenRouter AI models"""
    
    def __init__(self):
        if not config.validate_openrouter_config():
            raise OpenRouterError("OpenRouter API key is not configured")
        
        # Initialize OpenAI client with OpenRouter settings
        self.client = AsyncOpenAI(
            api_key=config.OPENROUTER_API_KEY,
            base_url=config.OPENROUTER_BASE_URL
        )
        
        self.default_model = config.DEFAULT_AI_MODEL
        self.fallback_model = config.FALLBACK_AI_MODEL
        self.timeout = config.AI_TIMEOUT
        self.max_retries = config.AI_MAX_RETRIES
        
        logger.info(f"OpenRouter service initialized with model: {self.default_model}")
    
    async def _make_completion_request(
        self,
        messages: List[AIMessage],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AIResponse:
        """Make a completion request to OpenRouter"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Prepare request parameters
            request_params = {
                "model": model,
                "messages": [{"role": msg.role, "content": msg.content} for msg in messages],
                "temperature": temperature or config.AI_TEMPERATURE,
                "max_tokens": max_tokens or config.AI_MAX_TOKENS,
                **kwargs
            }
            
            logger.debug(f"Making completion request to {model} with {len(messages)} messages")
            
            # Make the API call
            response = await self.client.chat.completions.create(**request_params)
            
            response_time = asyncio.get_event_loop().time() - start_time
            
            # Extract response data
            choice = response.choices[0]
            content = choice.message.content or ""
            finish_reason = choice.finish_reason
            tokens_used = getattr(response.usage, 'total_tokens', None) if hasattr(response, 'usage') else None
            
            return AIResponse(
                content=content,
                model_used=model,
                tokens_used=tokens_used,
                finish_reason=finish_reason,
                response_time=response_time
            )
            
        except Exception as e:
            response_time = asyncio.get_event_loop().time() - start_time
            logger.error(f"Error in completion request to {model}: {e} (took {response_time:.2f}s)")
            raise OpenRouterError(f"API call failed: {str(e)}")
    
    async def complete(
        self,
        messages: Union[List[AIMessage], List[Dict[str, str]], str],
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        use_fallback: bool = True,
        **kwargs
    ) -> AIResponse:
        """
        Generate a completion using OpenRouter AI models with retry and fallback logic.
        
        Args:
            messages: List of messages or a single string prompt
            model: Model to use (defaults to configured default)
            temperature: Generation temperature (0-1)
            max_tokens: Maximum tokens to generate
            use_fallback: Whether to use fallback model on failure
            **kwargs: Additional parameters for the API call
        """
        
        # Normalize messages to AIMessage objects
        if isinstance(messages, str):
            messages = [AIMessage(role="user", content=messages)]
        elif isinstance(messages, list) and messages and isinstance(messages[0], dict):
            messages = [AIMessage(**msg) for msg in messages]
        elif isinstance(messages, list) and messages and isinstance(messages[0], AIMessage):
            pass  # Already correct format
        else:
            raise ValueError("Messages must be a string, list of dicts, or list of AIMessage objects")
        
        target_model = model or self.default_model
        
        # Attempt with primary model
        for attempt in range(self.max_retries):
            try:
                logger.info(f"Attempt {attempt + 1}/{self.max_retries} with model {target_model}")
                return await self._make_completion_request(
                    messages=messages,
                    model=target_model,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    **kwargs
                )
            except OpenRouterError as e:
                logger.warning(f"Attempt {attempt + 1} failed with {target_model}: {e}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                continue
        
        # Try fallback model if enabled and different from primary
        if use_fallback and self.fallback_model != target_model:
            logger.info(f"Trying fallback model: {self.fallback_model}")
            for attempt in range(self.max_retries):
                try:
                    return await self._make_completion_request(
                        messages=messages,
                        model=self.fallback_model,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        **kwargs
                    )
                except OpenRouterError as e:
                    logger.warning(f"Fallback attempt {attempt + 1} failed: {e}")
                    if attempt < self.max_retries - 1:
                        await asyncio.sleep(2 ** attempt)
                    continue
        
        raise OpenRouterError("All attempts failed with both primary and fallback models")
    
    async def get_available_models(self) -> List[str]:
        """
        Get list of available models from OpenRouter.
        Note: This is a placeholder - OpenRouter doesn't have a public models endpoint.
        """
        return [
            "openai/gpt-4o-mini",
            "anthropic/claude-3-haiku",
            "google/gemma-3-27b-it:free",
            "google/gemini-2.5-flash-preview-05-20",
            "google/gemini-2.5-flash-preview-05-20:thinking"
        ]
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Perform a health check on the OpenRouter service.
        """
        try:
            # Simple test completion
            test_response = await self.complete(
                messages="Hello, this is a health check.",
                max_tokens=50,
                temperature=0.1
            )
            
            return {
                "status": "healthy",
                "model_available": True,
                "default_model": self.default_model,
                "fallback_model": self.fallback_model,
                "response_time": test_response.response_time,
                "test_successful": True
            }
            
        except Exception as e:
            logger.error(f"OpenRouter health check failed: {e}")
            return {
                "status": "unhealthy",
                "model_available": False,
                "default_model": self.default_model,
                "fallback_model": self.fallback_model,
                "error": str(e),
                "test_successful": False
            }

# Global service instance
openrouter_service: Optional[OpenRouterService] = None

def get_openrouter_service() -> OpenRouterService:
    """Get or create the OpenRouter service instance"""
    global openrouter_service
    
    if openrouter_service is None:
        openrouter_service = OpenRouterService()
    
    return openrouter_service 