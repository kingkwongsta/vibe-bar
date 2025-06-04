#!/usr/bin/env python3
"""
Test script for Drink Recipe Generation (Focused Backend)
Tests AI-powered drink recipe generation using OpenRouter LLM.
"""

import asyncio
import sys
import os
from datetime import datetime, UTC
from typing import Dict, Any
import json

# Add the app directory to the path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config import config
from app.services import get_openrouter_service, get_drink_service, OpenRouterError
from app.models import (
    DrinkGenerationRequest, DrinkRecommendationRequest, DrinkType, 
    FlavorProfile, MoodCategory, Difficulty
)

async def test_config_validation():
    """Test configuration validation for drink recipe generation"""
    print("🔧 Testing Configuration for Drink Recipe Generation...")
    
    print(f"✅ Environment: {config.ENVIRONMENT}")
    print(f"✅ OpenRouter configured: {config.validate_openrouter_config()}")
    print(f"✅ Default model: {config.DEFAULT_AI_MODEL}")
    print(f"✅ Fallback model: {config.FALLBACK_AI_MODEL}")
    print(f"✅ AI settings: temp={config.AI_TEMPERATURE}, tokens={config.AI_MAX_TOKENS}")
    
    if not config.validate_openrouter_config():
        print("⚠️  OpenRouter API key not configured - drink generation tests will be skipped")
        return False
    
    return True

async def test_drink_service_initialization():
    """Test drink service initialization"""
    print("\n🍹 Testing Drink Service Initialization...")
    
    try:
        drink_service = get_drink_service()
        print(f"✅ Drink service initialized successfully")
        print(f"✅ AI service available: {drink_service.ai_service is not None}")
        return drink_service
    except Exception as e:
        print(f"❌ Drink service initialization failed: {e}")
        return None

async def test_basic_drink_generation(drink_service):
    """Test basic drink recipe generation"""
    print("\n🍸 Testing Basic Drink Recipe Generation...")
    
    try:
        request = DrinkGenerationRequest(
            mood=MoodCategory.ENERGIZING,
            drink_type=DrinkType.COFFEE,
            flavor_preferences=[FlavorProfile.SWEET, FlavorProfile.CREAMY],
            time_of_day="morning",
            custom_request="I need an energizing coffee to start my productive day"
        )
        
        response = await drink_service.generate_drink_recipe(request)
        
        print(f"✅ Drink recipe generated successfully")
        print(f"   Recipe name: {response.recipe.name}")
        print(f"   Drink type: {response.recipe.drink_type}")
        print(f"   Flavors: {[fp.value for fp in response.recipe.flavor_profiles]}")
        print(f"   Prep time: {response.recipe.prep_time_minutes} minutes")
        print(f"   Difficulty: {response.recipe.difficulty}")
        print(f"   Ingredients count: {len(response.recipe.ingredients)}")
        print(f"   Instructions count: {len(response.recipe.instructions)}")
        print(f"   AI explanation: {response.ai_explanation[:100]}..." if response.ai_explanation else "   No AI explanation")
        
        return True
        
    except OpenRouterError as e:
        print(f"❌ Drink generation failed (OpenRouter): {e}")
        return False
    except Exception as e:
        print(f"❌ Drink generation failed (Unexpected): {e}")
        return False

async def test_cocktail_generation(drink_service):
    """Test cocktail recipe generation"""
    print("\n🍹 Testing Cocktail Recipe Generation...")
    
    try:
        request = DrinkGenerationRequest(
            mood=MoodCategory.CELEBRATORY,
            drink_type=DrinkType.COCKTAIL,
            flavor_preferences=[FlavorProfile.FRUITY, FlavorProfile.TROPICAL],
            occasion="birthday party",
            difficulty_preference=Difficulty.MEDIUM,
            custom_request="Create a festive tropical cocktail perfect for celebrations"
        )
        
        response = await drink_service.generate_drink_recipe(request)
        
        print(f"✅ Cocktail recipe generated successfully")
        print(f"   Recipe: {response.recipe.name}")
        print(f"   Description: {response.recipe.description[:100]}...")
        print(f"   Garnish: {response.recipe.garnish}")
        print(f"   Glassware: {response.recipe.glassware}")
        print(f"   Alternative suggestions: {len(response.alternative_suggestions)}")
        
        # Print ingredients
        print(f"   Ingredients:")
        for ingredient in response.recipe.ingredients[:3]:  # Show first 3
            print(f"     - {ingredient.amount} {ingredient.name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Cocktail generation failed: {e}")
        return False

async def test_mocktail_generation(drink_service):
    """Test mocktail (non-alcoholic) recipe generation"""
    print("\n🥤 Testing Mocktail Recipe Generation...")
    
    try:
        request = DrinkGenerationRequest(
            mood=MoodCategory.REFRESHING,
            drink_type=DrinkType.MOCKTAIL,
            flavor_preferences=[FlavorProfile.CITRUSY, FlavorProfile.REFRESHING],
            dietary_restrictions=["no alcohol", "low sugar"],
            time_of_day="afternoon",
            temperature_preference="cold",
            custom_request="A refreshing non-alcoholic drink for a hot afternoon"
        )
        
        response = await drink_service.generate_drink_recipe(request)
        
        print(f"✅ Mocktail recipe generated successfully")
        print(f"   Recipe: {response.recipe.name}")
        print(f"   Servings: {response.recipe.servings}")
        print(f"   Tags: {', '.join(response.recipe.tags)}")
        print(f"   Pairing suggestions: {len(response.pairing_suggestions)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Mocktail generation failed: {e}")
        return False

async def test_personalized_recommendations(drink_service):
    """Test personalized drink recommendations"""
    print("\n🎯 Testing Personalized Drink Recommendations...")
    
    try:
        request = DrinkRecommendationRequest(
            preferred_flavors=[FlavorProfile.SWEET, FlavorProfile.FRUITY, FlavorProfile.CREAMY],
            mood_pattern="generally energetic in mornings, relaxed in evenings",
            time_constraints=15,  # 15 minutes available
            skill_level=Difficulty.EASY
        )
        
        recommendations = await drink_service.get_drink_recommendations(request)
        
        print(f"✅ Generated {len(recommendations)} personalized recommendations")
        
        for i, rec in enumerate(recommendations, 1):
            print(f"   Recommendation {i}: {rec.recipe.name}")
            print(f"     Type: {rec.recipe.drink_type.value}")
            print(f"     Difficulty: {rec.recipe.difficulty.value}")
            print(f"     Prep time: {rec.recipe.prep_time_minutes} min")
        
        return True
        
    except Exception as e:
        print(f"❌ Personalized recommendations failed: {e}")
        return False

async def test_edge_cases(drink_service):
    """Test edge cases and error handling"""
    print("\n🧪 Testing Edge Cases...")
    
    # Test with minimal request
    try:
        minimal_request = DrinkGenerationRequest()
        response = await drink_service.generate_drink_recipe(minimal_request)
        print(f"✅ Minimal request handled: {response.recipe.name}")
    except Exception as e:
        print(f"⚠️  Minimal request failed: {e}")
    
    # Test with conflicting preferences
    try:
        conflicting_request = DrinkGenerationRequest(
            mood=MoodCategory.RELAXING,
            drink_type=DrinkType.COFFEE,
            flavor_preferences=[FlavorProfile.BITTER],
            avoid_flavors=[FlavorProfile.BITTER],
            custom_request="Make something that doesn't make sense"
        )
        response = await drink_service.generate_drink_recipe(conflicting_request)
        print(f"✅ Conflicting request handled: {response.recipe.name}")
    except Exception as e:
        print(f"⚠️  Conflicting request failed: {e}")
    
    return True

async def test_drink_variety(drink_service):
    """Test generation of different drink types"""
    print("\n🌈 Testing Drink Variety...")
    
    drink_types_to_test = [
        (DrinkType.TEA, MoodCategory.RELAXING, "evening"),
        (DrinkType.SMOOTHIE, MoodCategory.ENERGIZING, "morning"),
        (DrinkType.HOT_CHOCOLATE, MoodCategory.COMFORTING, "night"),
    ]
    
    success_count = 0
    
    for drink_type, mood, time in drink_types_to_test:
        try:
            request = DrinkGenerationRequest(
                drink_type=drink_type,
                mood=mood,
                time_of_day=time,
                custom_request=f"Perfect {drink_type.value} for {time}"
            )
            
            response = await drink_service.generate_drink_recipe(request)
            print(f"   ✅ {drink_type.value.title()}: {response.recipe.name}")
            success_count += 1
            
        except Exception as e:
            print(f"   ❌ {drink_type.value.title()} failed: {e}")
    
    print(f"✅ Successfully generated {success_count}/{len(drink_types_to_test)} drink types")
    return success_count == len(drink_types_to_test)

async def run_comprehensive_drink_test():
    """Run comprehensive test suite for drink recipe generation"""
    print("=" * 60)
    print("🍹 VIBE BAR - DRINK RECIPE GENERATION TEST SUITE")
    print("=" * 60)
    
    # Configuration validation
    config_valid = await test_config_validation()
    if not config_valid:
        print("\n❌ Configuration invalid - cannot proceed with AI tests")
        return False
    
    # Service initialization
    drink_service = await test_drink_service_initialization()
    if not drink_service:
        print("\n❌ Service initialization failed")
        return False
    
    # Core functionality tests
    tests = [
        ("Basic Drink Generation", test_basic_drink_generation(drink_service)),
        ("Cocktail Generation", test_cocktail_generation(drink_service)),
        ("Mocktail Generation", test_mocktail_generation(drink_service)),
        ("Personalized Recommendations", test_personalized_recommendations(drink_service)),
        ("Drink Variety", test_drink_variety(drink_service)),
        ("Edge Cases", test_edge_cases(drink_service)),
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
        print("🎉 All tests passed! Drink recipe generation is working perfectly!")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed. Please check the errors above.")
        return False

async def main():
    """Main test execution"""
    try:
        success = await run_comprehensive_drink_test()
        exit_code = 0 if success else 1
        
        print(f"\n{'='*60}")
        print("🍹 Vibe Bar Drink Recipe Generation - Test Complete")
        print(f"Exit Code: {exit_code}")
        print(f"{'='*60}")
        
        return exit_code
        
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error during testing: {e}")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code) 