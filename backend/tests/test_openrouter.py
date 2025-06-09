#!/usr/bin/env python3
"""
Pytest-compatible test suite for OpenRouter service integration
"""

import pytest
from app.config import config
from app.services.openrouter import get_openrouter_service, OpenRouterError, AIMessage
from app.models import UserPreferences, CocktailRecipe, RecipeIngredient, RecipeMeta, RecipeDetail


@pytest.fixture
def openrouter_service():
    """Fixture to provide OpenRouter service instance"""
    if not config.validate_openrouter_config():
        pytest.skip("OpenRouter API key not configured")
    
    service = get_openrouter_service()
    return service


@pytest.mark.asyncio
async def test_config_validation():
    """Test configuration validation"""
    assert hasattr(config, 'ENVIRONMENT')
    assert hasattr(config, 'DEFAULT_AI_MODEL')
    assert hasattr(config, 'FALLBACK_AI_MODEL')
    assert hasattr(config, 'AI_TEMPERATURE')
    assert hasattr(config, 'AI_MAX_TOKENS')
    
    # Test that validation method exists and returns boolean
    result = config.validate_openrouter_config()
    assert isinstance(result, bool)


@pytest.mark.asyncio
async def test_service_initialization():
    """Test OpenRouter service initialization"""
    if not config.validate_openrouter_config():
        pytest.skip("OpenRouter API key not configured")
    
    service = get_openrouter_service()
    assert service is not None
    assert hasattr(service, 'default_model')
    assert hasattr(service, 'fallback_model')
    assert hasattr(service, 'timeout')
    assert hasattr(service, 'max_retries')


@pytest.mark.asyncio
async def test_user_preferences_model():
    """Test UserPreferences model creation"""
    prefs = UserPreferences(
        ingredients=["gin", "lime"],
        flavors=["citrusy"],
        vibe="refreshing"
    )
    
    assert prefs.ingredients == ["gin", "lime"]
    assert prefs.flavors == ["citrusy"]
    assert prefs.vibe == "refreshing"


@pytest.mark.asyncio
async def test_cocktail_recipe_model():
    """Test CocktailRecipe model creation"""
    recipe = CocktailRecipe(
        recipeTitle="Test Cocktail",
        recipeDescription="A test cocktail",
        recipeMeta=[RecipeMeta(text="Easy")],
        recipeIngredients=[
            RecipeIngredient(name="Gin", amount="2 oz")
        ],
        recipeInstructions=["Mix well"],
        recipeDetails=[RecipeDetail(title="Glass", content="Rocks")]
    )
    
    assert recipe.recipeTitle == "Test Cocktail"
    assert len(recipe.recipeIngredients) == 1
    assert recipe.recipeIngredients[0].name == "Gin"


@pytest.mark.asyncio
async def test_basic_completion(openrouter_service):
    """Test basic AI completion"""
    service = openrouter_service
    
    response = await service.complete(
        messages="Hello, this is a test message. Please respond briefly.",
        max_tokens=100,
        temperature=0.7
    )
    
    assert response is not None
    assert hasattr(response, 'content')
    assert hasattr(response, 'model_used')
    assert hasattr(response, 'response_time')
    assert len(response.content) > 0


@pytest.mark.asyncio
async def test_structured_messages(openrouter_service):
    """Test completion with structured messages"""
    service = openrouter_service
    
    messages = [
        AIMessage(role="system", content="You are a helpful assistant. Keep responses brief."),
        AIMessage(role="user", content="What is the capital of France?"),
    ]
    
    response = await service.complete(
        messages=messages,
        max_tokens=50,
        temperature=0.1
    )
    
    assert response is not None
    assert "Paris" in response.content or "paris" in response.content.lower()


@pytest.mark.asyncio
async def test_cocktail_generation(openrouter_service):
    """Test cocktail recipe generation functionality"""
    service = openrouter_service
    
    user_prefs = UserPreferences(
        ingredients=["gin"],
        flavors=["citrusy"],
        vibe="refreshing"
    )
    
    response = await service.complete(
        messages=f"Generate a cocktail recipe based on these preferences: {user_prefs.model_dump()}",
        max_tokens=300,
        temperature=0.7
    )
    
    assert response is not None
    assert len(response.content) > 50  # Should be a substantial response
    assert "gin" in response.content.lower()


@pytest.mark.asyncio
async def test_error_handling(openrouter_service):
    """Test error handling with invalid inputs"""
    service = openrouter_service
    
    # Test with empty messages - should raise an error
    with pytest.raises((OpenRouterError, ValueError)):
        await service.complete(messages="")
    
    # Test with invalid model - should raise an error
    with pytest.raises(OpenRouterError):
        await service.complete(
            messages="Test message",
            model="invalid/model-name",
            max_tokens=50
        ) 