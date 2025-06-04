#!/usr/bin/env python3
"""
Simple test script for Cocktail Recipe Generation
Tests the simplified AI-powered cocktail recipe generation using OpenRouter LLM.
"""

import asyncio
import sys
import os

# Add the app directory to the path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config import config
from app.services import get_cocktail_service, OpenRouterError
from app.models import UserPreferences

async def test_simple_cocktail_generation():
    """Test simple cocktail recipe generation"""
    print("🍸 Testing Simple Cocktail Recipe Generation...")
    
    if not config.validate_openrouter_config():
        print("⚠️  OpenRouter API key not configured - skipping test")
        return False
    
    try:
        cocktail_service = get_cocktail_service()
        print("✅ Cocktail service initialized")
        
        # Test with user preferences matching frontend structure
        preferences = UserPreferences(
            baseSpirits=["gin"],
            flavorProfiles=["herbal", "citrusy"],
            defaultStrength="medium",
            dietaryRestrictions=[],
            defaultVibe="sophisticated",
            preferredVibes=["elegant", "classic"]
        )
        
        recipe = await cocktail_service.generate_cocktail_recipe(preferences)
        
        print(f"✅ Recipe generated successfully!")
        print(f"   Title: {recipe.recipeTitle}")
        print(f"   Description: {recipe.recipeDescription[:100]}...")
        print(f"   Meta: {[meta.text for meta in recipe.recipeMeta]}")
        print(f"   Ingredients: {len(recipe.recipeIngredients)} items")
        print(f"   Instructions: {len(recipe.recipeInstructions)} steps")
        print(f"   Details: {len(recipe.recipeDetails)} details")
        
        # Show sample ingredients
        print("   Sample ingredients:")
        for ing in recipe.recipeIngredients[:3]:
            print(f"     - {ing.amount} {ing.name}")
            
        # Show details
        for detail in recipe.recipeDetails:
            print(f"   {detail.title}: {detail.content}")
        
        return True
        
    except OpenRouterError as e:
        print(f"❌ OpenRouter error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

async def test_empty_preferences():
    """Test with empty preferences"""
    print("\n🥤 Testing Empty Preferences...")
    
    try:
        cocktail_service = get_cocktail_service()
        
        # Test with empty preferences
        preferences = UserPreferences()
        
        recipe = await cocktail_service.generate_cocktail_recipe(preferences)
        
        print(f"✅ Recipe generated with empty preferences!")
        print(f"   Title: {recipe.recipeTitle}")
        print(f"   Description: {recipe.recipeDescription[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error with empty preferences: {e}")
        return False

async def test_multiple_preferences():
    """Test with multiple preferences"""
    print("\n🥃 Testing Multiple Preferences...")
    
    try:
        cocktail_service = get_cocktail_service()
        
        # Test with multiple preferences
        preferences = UserPreferences(
            baseSpirits=["whiskey", "bourbon"],
            flavorProfiles=["smoky", "sweet"],
            defaultStrength="strong",
            dietaryRestrictions=["no nuts"],
            defaultVibe="cozy",
            preferredVibes=["winter", "evening"]
        )
        
        recipe = await cocktail_service.generate_cocktail_recipe(preferences)
        
        print(f"✅ Recipe generated with multiple preferences!")
        print(f"   Title: {recipe.recipeTitle}")
        print(f"   Prep: {recipe.recipeMeta[0].text if recipe.recipeMeta else 'N/A'}")
        print(f"   Difficulty: {recipe.recipeMeta[1].text if len(recipe.recipeMeta) > 1 else 'N/A'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error with multiple preferences: {e}")
        return False

async def main():
    """Main test execution"""
    print("=" * 60)
    print("🍸 VIBE BAR - SIMPLE COCKTAIL RECIPE GENERATION TEST")
    print("=" * 60)
    
    tests = [
        ("Simple Cocktail Generation", test_simple_cocktail_generation()),
        ("Empty Preferences", test_empty_preferences()),
        ("Multiple Preferences", test_multiple_preferences()),
    ]
    
    results = []
    for test_name, test_coro in tests:
        try:
            result = await test_coro
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! Simple cocktail recipe generation is working!")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed.")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1) 