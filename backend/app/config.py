"""
Configuration module for Vibe Bar API.
Handles environment variables and application settings.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration class."""
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Frontend Configuration
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # OpenRouter Configuration
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_BASE_URL: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    DEFAULT_AI_MODEL: str = os.getenv("DEFAULT_AI_MODEL", "openai/gpt-4o-mini")
    FALLBACK_AI_MODEL: str = os.getenv("FALLBACK_AI_MODEL", "openai/gpt-3.5-turbo")
    
    # AI Configuration
    AI_TIMEOUT: int = int(os.getenv("AI_TIMEOUT", "30"))
    AI_MAX_RETRIES: int = int(os.getenv("AI_MAX_RETRIES", "3"))
    AI_TEMPERATURE: float = float(os.getenv("AI_TEMPERATURE", "0.7"))
    AI_MAX_TOKENS: int = int(os.getenv("AI_MAX_TOKENS", "1000"))
    
    @classmethod
    def is_development(cls) -> bool:
        """Check if running in development mode."""
        return cls.ENVIRONMENT.lower() == "development"
    
    @classmethod
    def is_production(cls) -> bool:
        """Check if running in production mode."""
        return cls.ENVIRONMENT.lower() == "production"
    
    @classmethod
    def validate_openrouter_config(cls) -> bool:
        """Validate that OpenRouter is properly configured."""
        return cls.OPENROUTER_API_KEY is not None and cls.OPENROUTER_API_KEY.strip() != ""

# Global config instance
config = Config() 