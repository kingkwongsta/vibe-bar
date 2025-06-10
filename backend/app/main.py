# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, UTC
import logging
import uvicorn
import time

# Import routers
from app.routers import community_vibes

# Import models and services
from app.models import (
    APIResponse, HealthCheck, UserPreferences, CocktailRecipe,
    CommunityVibeRecipeCreate, CommunityVibeRecipe, CommunityVibeRecipeList,
    CommunityVibeRecipeFilters, RecipeStats
)
from app.services import (
    get_openrouter_service, get_cocktail_service, get_community_vibes_service,
    database_service, OpenRouterError
)
from app.config import config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Vibe Bar API - AI Cocktail Recipe Generator",
    description="AI-Powered Cocktail Recipe Generation using OpenRouter LLM with Community Vibes",
    version="2.1.0",
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

# Include routers
app.include_router(community_vibes.router)

# Root endpoint
@app.get("/", response_model=APIResponse)
async def root():
    """Root endpoint returning API information"""
    return APIResponse(
        message="Welcome to Vibe Bar - AI Cocktail Recipe Generator with Community Vibes",
        data={
            "api_name": "Vibe Bar Cocktail Recipe Generator",
            "version": "2.1.0",
            "description": "AI-Powered Cocktail Recipe Generation using OpenRouter LLM",
            "docs_url": "/docs",
            "features": [
                "Generate custom cocktail recipes based on user preferences",
                "Support for various base spirits and flavor profiles",
                "Personalized recipes based on vibes and dietary restrictions",
                "Community Vibes - Save and share user-generated recipes",
                "Recipe rating and review system",
                "Search and discovery features",
                "Community statistics and insights"
            ],
            "endpoints": {
                "ai_generation": "/api/cocktails/generate",
                "community_vibes": "/api/community-vibes/recipes",
                "search": "/api/community-vibes/recipes/search",
                "stats": "/api/community-vibes/stats"
            }
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
        version="2.1.0"
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
            "ai_service_available": config.validate_openrouter_config(),
            "database_available": database_service.is_connected(),
            "community_vibes_available": True
        }
    )

# Database health check endpoint
@app.get("/api/database/health", response_model=APIResponse)
async def database_health_check():
    """Check the health of the database connection"""
    try:
        health_status = await database_service.health_check()
        return APIResponse(
            message="Database health check completed",
            data=health_status
        )
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Database service unavailable: {str(e)}")

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
    # Start timing the request
    start_time = time.time()
    
    try:
        logger.info(f"Generating cocktail recipe for preferences: {preferences}")
        print(f"[TIMING] Starting cocktail generation at {datetime.now(UTC).strftime('%H:%M:%S')}")
        
        recipe = await cocktail_service.generate_cocktail_recipe(preferences)
        
        # Calculate and log the request duration
        end_time = time.time()
        duration = end_time - start_time
        logger.info(f"Cocktail recipe generation completed in {duration:.2f} seconds")
        print(f"[TIMING] Cocktail recipe generation completed in {duration:.2f} seconds")
        
        return APIResponse(
            message="Cocktail recipe generated successfully",
            data=recipe.model_dump()
        )
        
    except OpenRouterError as e:
        # Log duration even on error
        end_time = time.time()
        duration = end_time - start_time
        logger.error(f"OpenRouter error in cocktail generation after {duration:.2f} seconds: {e}")
        print(f"[TIMING] OpenRouter error after {duration:.2f} seconds: {e}")
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except Exception as e:
        # Log duration even on error
        end_time = time.time()
        duration = end_time - start_time
        logger.error(f"Unexpected error in cocktail generation after {duration:.2f} seconds: {e}")
        print(f"[TIMING] Unexpected error after {duration:.2f} seconds: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# =============================================================================
# RECIPE SAVING ENDPOINT
# =============================================================================

@app.post("/api/cocktails/save", response_model=APIResponse)
async def save_cocktail_recipe(
    data: dict = Body(
        ...,
        example={
            "recipe": {
                "recipeTitle": "Midnight Garden",
                "recipeDescription": "A sophisticated gin-based cocktail",
                "recipeMeta": [{"text": "5 min prep"}, {"text": "Easy"}, {"text": "1 serving"}],
                "recipeIngredients": [{"name": "Gin", "amount": "2 oz"}],
                "recipeInstructions": ["Combine ingredients", "Stir and serve"],
                "recipeDetails": [{"title": "Glassware", "content": "Coupe glass"}]
            },
            "preferences": {
                "ingredients": ["gin"],
                "flavors": ["botanical"],
                "vibe": "relaxing",
                "model": "anthropic/claude-3-haiku"
            },
            "creator": {
                "name": "John Doe",
                "email": "john@example.com"
            }
        }
    ),
    community_service = Depends(get_community_vibes_service)
):
    """Save a generated cocktail recipe to the database"""
    try:
        # Extract data from request
        recipe_data = data.get("recipe")
        preferences_data = data.get("preferences", {})
        creator_data = data.get("creator", {})
        
        if not recipe_data:
            raise HTTPException(status_code=400, detail="Recipe data is required")
        
        # Convert recipe data to CocktailRecipe model
        from app.models.cocktail import CocktailRecipe, RecipeMeta, RecipeIngredient, RecipeDetail
        
        recipe = CocktailRecipe(
            recipeTitle=recipe_data.get("recipeTitle", ""),
            recipeDescription=recipe_data.get("recipeDescription", ""),
            recipeMeta=[RecipeMeta(text=meta.get("text", "")) for meta in recipe_data.get("recipeMeta", [])],
            recipeIngredients=[RecipeIngredient(name=ing.get("name", ""), amount=ing.get("amount", "")) for ing in recipe_data.get("recipeIngredients", [])],
            recipeInstructions=recipe_data.get("recipeInstructions", []),
            recipeDetails=[RecipeDetail(title=detail.get("title", ""), content=detail.get("content", "")) for detail in recipe_data.get("recipeDetails", [])]
        )
        
        # Convert preferences to UserPreferences model
        preferences = UserPreferences(
            ingredients=preferences_data.get("ingredients", []),
            customIngredients=preferences_data.get("customIngredients"),
            flavors=preferences_data.get("flavors", []),
            vibe=preferences_data.get("vibe"),
            specialRequests=preferences_data.get("specialRequests"),
            model=preferences_data.get("model")
        )
        
        # Save the recipe to database
        saved_recipe = await community_service.create_recipe_from_ai_generation(
            ai_recipe=recipe,
            user_preferences=preferences,
            creator_name=creator_data.get("name", "Anonymous"),
            creator_email=creator_data.get("email")
        )
        
        logger.info(f"Successfully saved recipe: {saved_recipe.name} (ID: {saved_recipe.id})")
        
        return APIResponse(
            message="Recipe saved successfully",
            data={
                "recipe_id": str(saved_recipe.id),
                "recipe_name": saved_recipe.name,
                "creator": saved_recipe.creator_name,
                "created_at": saved_recipe.created_at.isoformat(),
                "vibe": saved_recipe.vibe,
                "ai_model_used": saved_recipe.ai_model_used
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to save recipe: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save recipe: {str(e)}")

# =============================================================================
# COMMUNITY VIBES TEST ENDPOINTS (keeping for backward compatibility)
# =============================================================================

@app.get("/api/community-vibes/test", response_model=APIResponse)
async def test_community_vibes():
    """Test endpoint to validate Community Vibes backend implementation"""
    try:
        community_service = get_community_vibes_service()
        
        # Test database connection
        db_health = await database_service.health_check()
        
        # Test getting recipes (should work even with empty database)
        try:
            recipes = await community_service.get_recipes(page=1, per_page=5)
            recipes_available = True
            recipes_count = recipes.total_count
        except Exception as e:
            recipes_available = False
            recipes_count = 0
            logger.warning(f"Could not fetch recipes: {e}")
        
        # Test community stats
        try:
            stats = await community_service.get_community_stats()
            stats_available = True
        except Exception as e:
            stats_available = False
            stats = None
            logger.warning(f"Could not fetch stats: {e}")
        
        return APIResponse(
            message="Community Vibes backend test completed",
            data={
                "database_connected": db_health.get("connected", False),
                "database_status": db_health.get("status"),
                "recipes_service_available": recipes_available,
                "total_recipes": recipes_count,
                "stats_service_available": stats_available,
                "community_stats": stats.model_dump() if stats else None,
                "supabase_configured": config.validate_supabase_config(),
                "production_endpoints_available": True,
                "timestamp": datetime.now(UTC).isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"Community Vibes test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Community Vibes test failed: {str(e)}")

@app.post("/api/community-vibes/test-create", response_model=APIResponse)
async def test_create_community_recipe():
    """Test endpoint to create a sample Community Vibe recipe"""
    try:
        community_service = get_community_vibes_service()
        
        # Create a test recipe
        test_recipe_data = CommunityVibeRecipeCreate(
            name="API Test Cocktail",
            description="A test cocktail recipe created via API to validate backend functionality",
            ingredients=[
                {"name": "Test Spirit", "amount": "2 oz"},
                {"name": "Test Mixer", "amount": "1 oz"}
            ],
            instructions=[
                "Combine ingredients in a shaker",
                "Shake well with ice",
                "Strain into glass",
                "Serve immediately"
            ],
            creator_name="Backend Test",
            tags=["test", "api", "validation"],
            flavor_profile=["balanced"],
            vibe="Testing Vibes",
            difficulty_level="Easy",
            prep_time_minutes=3,
            servings=1
        )
        
        recipe = await community_service.create_recipe(test_recipe_data)
        
        return APIResponse(
            message="Test Community Vibe recipe created successfully",
            data={
                "recipe_id": str(recipe.id),
                "recipe_name": recipe.name,
                "created_at": recipe.created_at.isoformat(),
                "creator": recipe.creator_name,
                "tags": recipe.tags
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to create test recipe: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create test recipe: {str(e)}")

@app.get("/api/community-vibes/test-list", response_model=APIResponse)
async def test_list_community_recipes():
    """Test endpoint to list Community Vibe recipes"""
    try:
        community_service = get_community_vibes_service()
        
        # Get recipes with pagination
        recipes = await community_service.get_recipes(page=1, per_page=10)
        
        return APIResponse(
            message="Community Vibe recipes retrieved successfully",
            data={
                "total_recipes": recipes.total_count,
                "page": recipes.page,
                "per_page": recipes.per_page,
                "total_pages": recipes.total_pages,
                "recipes": [
                    {
                        "id": str(recipe.id),
                        "name": recipe.name,
                        "description": recipe.description[:100] + "..." if len(recipe.description) > 100 else recipe.description,
                        "creator": recipe.creator_name,
                        "tags": recipe.tags,
                        "difficulty": recipe.difficulty_level,
                        "rating": recipe.rating_average,
                        "created_at": recipe.created_at.isoformat()
                    }
                    for recipe in recipes.recipes
                ]
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to list recipes: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list recipes: {str(e)}")

@app.post("/api/community-vibes/save-ai-recipe", response_model=APIResponse)
async def test_save_ai_recipe():
    """Test endpoint to save an AI-generated recipe as Community Vibe"""
    try:
        # First generate an AI recipe
        cocktail_service = get_cocktail_service()
        community_service = get_community_vibes_service()
        
        # Test preferences
        test_preferences = UserPreferences(
            ingredients=["gin"],
            flavors=["botanical", "fresh"],
            vibe="relaxing evening",
            specialRequests="light and refreshing"
        )
        
        # Generate AI recipe
        ai_recipe = await cocktail_service.generate_cocktail_recipe(test_preferences)
        
        # Save as Community Vibe
        community_recipe = await community_service.create_recipe_from_ai_generation(
            ai_recipe=ai_recipe,
            user_preferences=test_preferences,
            creator_name="AI Recipe Test User",
            creator_email="test@vibes-bar.com"
        )
        
        return APIResponse(
            message="AI-generated recipe saved as Community Vibe successfully",
            data={
                "original_ai_recipe": ai_recipe.recipeTitle,
                "community_recipe_id": str(community_recipe.id),
                "community_recipe_name": community_recipe.name,
                "creator": community_recipe.creator_name,
                "vibe": community_recipe.vibe,
                "ai_model_used": community_recipe.ai_model_used,
                "created_at": community_recipe.created_at.isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to save AI recipe as Community Vibe: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save AI recipe: {str(e)}")

if __name__ == "__main__":
    # Use configuration for server settings
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=config.is_development()
    ) 