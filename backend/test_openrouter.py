#!/usr/bin/env python3
"""
Test script for OpenRouter integration (Phase 4)
Tests AI service functionality, endpoints, and error handling.
"""

import asyncio
import sys
import os
from datetime import datetime, UTC
from typing import Dict, Any

# Add the app directory to the path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config import config
from app.services.openrouter import get_openrouter_service, OpenRouterError, AIMessage
from app.models import VibeCreate, VibeCategory, MoodCreate, MoodType, EmotionalState

async def test_config_validation():
    """Test configuration validation"""
    print("🔧 Testing Configuration...")
    
    print(f"✅ Environment: {config.ENVIRONMENT}")
    print(f"✅ OpenRouter configured: {config.validate_openrouter_config()}")
    print(f"✅ Default model: {config.DEFAULT_AI_MODEL}")
    print(f"✅ Fallback model: {config.FALLBACK_AI_MODEL}")
    print(f"✅ AI settings: temp={config.AI_TEMPERATURE}, tokens={config.AI_MAX_TOKENS}")
    
    if not config.validate_openrouter_config():
        print("⚠️  OpenRouter API key not configured - some tests will be skipped")
        return False
    
    return True

async def test_service_initialization():
    """Test OpenRouter service initialization"""
    print("\n🚀 Testing Service Initialization...")
    
    try:
        service = get_openrouter_service()
        print(f"✅ Service initialized successfully")
        print(f"✅ Default model: {service.default_model}")
        print(f"✅ Fallback model: {service.fallback_model}")
        print(f"✅ Timeout: {service.timeout}s")
        print(f"✅ Max retries: {service.max_retries}")
        return service
    except OpenRouterError as e:
        print(f"❌ Service initialization failed: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None

async def test_health_check(service):
    """Test service health check"""
    print("\n🏥 Testing Health Check...")
    
    try:
        health_status = await service.health_check()
        print(f"✅ Health check completed")
        print(f"   Status: {health_status['status']}")
        print(f"   Model available: {health_status['model_available']}")
        print(f"   Response time: {health_status.get('response_time', 'N/A')}s")
        
        if health_status['status'] == 'healthy':
            print("✅ Service is healthy and ready")
            return True
        else:
            print("⚠️  Service health check indicates issues")
            return False
            
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

async def test_basic_completion(service):
    """Test basic AI completion"""
    print("\n💬 Testing Basic Completion...")
    
    try:
        response = await service.complete(
            messages="Hello, this is a test message. Please respond briefly.",
            max_tokens=100,
            temperature=0.7
        )
        
        print(f"✅ Completion successful")
        print(f"   Model used: {response.model_used}")
        print(f"   Response time: {response.response_time:.2f}s")
        print(f"   Tokens used: {response.tokens_used}")
        print(f"   Response: {response.content[:100]}...")
        
        return True
        
    except OpenRouterError as e:
        print(f"❌ Completion failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

async def test_structured_messages(service):
    """Test completion with structured messages"""
    print("\n📝 Testing Structured Messages...")
    
    try:
        messages = [
            AIMessage(role="system", content="You are a helpful assistant. Keep responses brief."),
            AIMessage(role="user", content="What is the capital of France?"),
        ]
        
        response = await service.complete(
            messages=messages,
            max_tokens=50,
            temperature=0.1
        )
        
        print(f"✅ Structured completion successful")
        print(f"   Response: {response.content}")
        
        return True
        
    except Exception as e:
        print(f"❌ Structured completion failed: {e}")
        return False

async def test_vibe_analysis(service):
    """Test vibe analysis functionality"""
    print("\n🎯 Testing Vibe Analysis...")
    
    try:
        response = await service.analyze_vibe(
            vibe_title="Morning Motivation",
            vibe_description="Feeling energized and ready to tackle my goals",
            user_context={"time_of_day": "morning"}
        )
        
        print(f"✅ Vibe analysis successful")
        print(f"   Model used: {response.model_used}")
        print(f"   Response time: {response.response_time:.2f}s")
        print(f"   Analysis: {response.content}")
        
        return True
        
    except Exception as e:
        print(f"❌ Vibe analysis failed: {e}")
        return False

async def test_mood_insights(service):
    """Test mood insights generation"""
    print("\n😊 Testing Mood Insights...")
    
    try:
        mood_data = {
            "primary_mood": "motivated",
            "energy_level": 8,
            "stress_level": 3,
            "notes": "Great start to the week, feeling productive"
        }
        
        response = await service.generate_mood_insights(mood_data)
        
        print(f"✅ Mood insights successful")
        print(f"   Model used: {response.model_used}")
        print(f"   Response time: {response.response_time:.2f}s")
        print(f"   Insights: {response.content}")
        
        return True
        
    except Exception as e:
        print(f"❌ Mood insights failed: {e}")
        return False

async def test_error_handling(service):
    """Test error handling and retry logic"""
    print("\n🚨 Testing Error Handling...")
    
    # Test with invalid model
    try:
        await service.complete(
            messages="Test message",
            model="invalid/model-name",
            max_tokens=50
        )
        print("⚠️  Invalid model test should have failed")
        return False
    except OpenRouterError:
        print("✅ Invalid model correctly rejected")
    except Exception as e:
        print(f"✅ Invalid model handling: {e}")
    
    # Test with empty messages
    try:
        await service.complete(messages="")
        print("⚠️  Empty message test should have failed")
        return False
    except (OpenRouterError, ValueError):
        print("✅ Empty messages correctly rejected")
    except Exception as e:
        print(f"✅ Empty message handling: {e}")
    
    return True

async def test_model_fallback(service):
    """Test model fallback functionality"""
    print("\n🔄 Testing Model Fallback...")
    
    try:
        # Try with a potentially unavailable model to test fallback
        response = await service.complete(
            messages="Test fallback mechanism",
            model="openai/gpt-4",  # Might not be available, should fallback
            max_tokens=50,
            use_fallback=True
        )
        
        print(f"✅ Fallback test completed")
        print(f"   Final model used: {response.model_used}")
        print(f"   Response: {response.content[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"⚠️  Fallback test: {e}")
        return False

async def test_integration_examples():
    """Test integration examples using actual models"""
    print("\n🔗 Testing Integration Examples...")
    
    # Test vibe creation example
    print("   Testing vibe creation...")
    vibe_example = VibeCreate(
        title="Productive Morning",
        description="Feeling focused and ready to work",
        category=VibeCategory.WORK,
        mood_score=8,
        tags=["productive", "focused"]
    )
    print(f"   ✅ Vibe example: {vibe_example.title} - {vibe_example.category}")
    
    # Test mood creation example
    print("   Testing mood creation...")
    mood_example = MoodCreate(
        primary_mood=MoodType.MOTIVATED,
        emotional_state=EmotionalState.POSITIVE,
        energy_level=7,
        stress_level=2,
        notes="Ready for challenges"
    )
    print(f"   ✅ Mood example: {mood_example.primary_mood} - {mood_example.emotional_state}")
    
    return True

async def run_comprehensive_test():
    """Run comprehensive OpenRouter integration tests"""
    print("🚀 OpenRouter Integration Tests (Phase 4)")
    print("=" * 60)
    
    # Test configuration
    config_ok = await test_config_validation()
    if not config_ok:
        print("\n❌ Configuration issues detected. Please check your .env file.")
        return False
    
    # Initialize service
    service = await test_service_initialization()
    if not service:
        print("\n❌ Service initialization failed. Cannot continue tests.")
        return False
    
    # Run tests
    tests = [
        ("Health Check", test_health_check(service)),
        ("Basic Completion", test_basic_completion(service)),
        ("Structured Messages", test_structured_messages(service)),
        ("Vibe Analysis", test_vibe_analysis(service)),
        ("Mood Insights", test_mood_insights(service)),
        ("Error Handling", test_error_handling(service)),
        ("Model Fallback", test_model_fallback(service)),
        ("Integration Examples", test_integration_examples())
    ]
    
    results = []
    for test_name, test_coro in tests:
        try:
            result = await test_coro
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Tests passed: {passed}/{len(results)}")
    
    if passed == len(results):
        print("🎉 All tests passed! OpenRouter integration is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return False

async def main():
    """Main test runner"""
    try:
        success = await run_comprehensive_test()
        
        print("\n" + "=" * 60)
        if success:
            print("✅ OpenRouter integration setup complete and working!")
            print("\nNext steps:")
            print("1. Start the backend server: uvicorn app.main:app --reload")
            print("2. Test endpoints at http://localhost:8000/docs")
            print("3. Try the AI endpoints: /api/ai/health, /api/ai/complete")
        else:
            print("❌ Some issues detected. Please review the test output.")
            print("\nTroubleshooting:")
            print("1. Check your .env file has OPENROUTER_API_KEY set")
            print("2. Verify your API key is valid")
            print("3. Check your internet connection")
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n❌ Unexpected error in test runner: {e}")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main()) 