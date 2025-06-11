#!/usr/bin/env python3
"""
Simple test script to validate Community Vibes backend implementation.
This script tests the core functionality without needing a running server.
"""

import asyncio
import sys
import os

# Add the current directory to Python path to enable imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_community_vibes_backend():
    """Test the Community Vibes backend implementation."""
    print("🧪 Testing Community Vibes Backend Implementation")
    print("=" * 50)
    
    try:
        # Test 1: Import all modules
        print("1. Testing module imports...")
        from app.config import config
        from app.services.database import database_service
        from app.services.community_vibes_service import community_vibes_service
        from app.models.community_vibes import CommunityVibeRecipeCreate
        from app.models.cocktail import RecipeIngredient
        print("   ✅ All modules imported successfully")
        
        # Test 2: Check configuration
        print("\n2. Testing configuration...")
        supabase_configured = config.validate_supabase_config()
        openrouter_configured = config.validate_openrouter_config()
        print(f"   Supabase configured: {'✅' if supabase_configured else '❌'}")
        print(f"   OpenRouter configured: {'✅' if openrouter_configured else '❌'}")
        
        # Test 3: Test database service initialization
        print("\n3. Testing database service...")
        print(f"   Database service created: {'✅' if database_service else '❌'}")
        print(f"   Database connected: {'✅' if database_service.is_connected() else '❌'}")
        
        # Test 4: Test Community Vibes service initialization
        print("\n4. Testing Community Vibes service...")
        print(f"   Community Vibes service created: {'✅' if community_vibes_service else '❌'}")
        
        # Test 5: Test model creation (without database)
        print("\n5. Testing data models...")
        try:
            test_recipe = CommunityVibeRecipeCreate(
                name="Test Recipe",
                description="A test recipe for validation",
                ingredients=[
                    RecipeIngredient(name="Test Ingredient", amount="1 oz")
                ],
                instructions=["Mix well", "Serve chilled"],
                creator_name="Test User",
                tags=["test"],
                difficulty_level="Easy"
            )
            print("   ✅ Data models work correctly")
            print(f"   Recipe name: {test_recipe.name}")
            print(f"   Ingredients: {len(test_recipe.ingredients)}")
            print(f"   Tags: {test_recipe.tags}")
        except Exception as e:
            print(f"   ❌ Data model error: {e}")
        
        # Test 6: Test database connection (if configured)
        if supabase_configured:
            print("\n6. Testing database connection...")
            try:
                health = await database_service.health_check()
                print(f"   Database health: {health.get('status', 'unknown')}")
                if health.get('connected'):
                    print("   ✅ Database connection successful")
                else:
                    print("   ❌ Database connection failed")
            except Exception as e:
                print(f"   ❌ Database connection error: {e}")
        else:
            print("\n6. Skipping database connection test (not configured)")
        
        print("\n" + "=" * 50)
        print("🎉 Community Vibes Backend Test Complete!")
        print("\nNext Steps:")
        if not supabase_configured:
            print("- Set up Supabase credentials in .env file")
            print("- Run the database schema (backend/database/schema.sql)")
        print("- Start FastAPI server: python -m app.main")
        print("- Test API endpoints at http://localhost:8000/docs")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure all dependencies are installed:")
        print("pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Run the test."""
    try:
        # Run the async test
        success = asyncio.run(test_community_vibes_backend())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to run test: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 