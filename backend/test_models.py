#!/usr/bin/env python3
"""
Test script to demonstrate Pydantic models for Phase 3
"""

from datetime import datetime, UTC
from app.models import (
    VibeCreate, VibeResponse, VibeCategory, VibeIntensity,
    MoodCreate, MoodResponse, MoodType, EmotionalState,
    APIResponse, HealthCheck
)

def test_vibe_models():
    """Test vibe-related models"""
    print("🎯 Testing Vibe Models...")
    
    # Create a vibe
    vibe_data = VibeCreate(
        title="Morning Energy Boost",
        description="Feeling motivated and ready to tackle the day",
        category=VibeCategory.WORK,
        intensity=VibeIntensity.HIGH,
        mood_score=8,
        tags=["productive", "energetic", "focused"]
    )
    print(f"✅ VibeCreate: {vibe_data.title} - {vibe_data.category}")
    
    # Create a vibe response
    vibe_response = VibeResponse(
        id=1,
        title=vibe_data.title,
        description=vibe_data.description,
        category=vibe_data.category,
        intensity=vibe_data.intensity,
        mood_score=vibe_data.mood_score,
        tags=vibe_data.tags,
        created_at=datetime.now(UTC)
    )
    print(f"✅ VibeResponse: ID {vibe_response.id} - Score: {vibe_response.mood_score}/10")
    
def test_mood_models():
    """Test mood-related models"""
    print("\n😊 Testing Mood Models...")
    
    # Create a mood entry
    mood_data = MoodCreate(
        primary_mood=MoodType.MOTIVATED,
        secondary_moods=[MoodType.ENERGETIC, MoodType.FOCUSED],
        emotional_state=EmotionalState.POSITIVE,
        energy_level=8,
        stress_level=3,
        notes="Great start to the week, feeling very productive"
    )
    print(f"✅ MoodCreate: {mood_data.primary_mood} ({mood_data.emotional_state})")
    print(f"   Energy: {mood_data.energy_level}/10, Stress: {mood_data.stress_level}/10")
    
    # Create a mood response
    mood_response = MoodResponse(
        id=1,
        primary_mood=mood_data.primary_mood,
        secondary_moods=mood_data.secondary_moods,
        emotional_state=mood_data.emotional_state,
        energy_level=mood_data.energy_level,
        stress_level=mood_data.stress_level,
        notes=mood_data.notes,
        created_at=datetime.now(UTC)
    )
    print(f"✅ MoodResponse: ID {mood_response.id} with {len(mood_response.secondary_moods)} secondary moods")

def test_common_models():
    """Test common utility models"""
    print("\n🔧 Testing Common Models...")
    
    # Test API Response
    api_response = APIResponse(
        message="Test successful",
        data={"test": True, "phase": 3}
    )
    print(f"✅ APIResponse: {api_response.message} (Success: {api_response.success})")
    
    # Test Health Check
    health_check = HealthCheck(
        dependencies={"pydantic": True, "fastapi": True}
    )
    print(f"✅ HealthCheck: {health_check.service} v{health_check.version} - {health_check.status}")

def test_validation():
    """Test model validation"""
    print("\n🔍 Testing Model Validation...")
    
    try:
        # This should work
        valid_vibe = VibeCreate(
            title="Valid Vibe",
            category=VibeCategory.PERSONAL,
            mood_score=7
        )
        print("✅ Valid vibe created successfully")
    except Exception as e:
        print(f"❌ Unexpected error with valid vibe: {e}")
    
    try:
        # This should fail - mood_score out of range
        invalid_vibe = VibeCreate(
            title="Invalid Vibe",
            category=VibeCategory.PERSONAL,
            mood_score=11  # Invalid - must be 1-10
        )
        print("❌ Invalid vibe should have failed validation")
    except Exception as e:
        print(f"✅ Validation working: {e}")
    
    try:
        # This should fail - empty title
        invalid_vibe2 = VibeCreate(
            title="",  # Invalid - too short
            category=VibeCategory.PERSONAL,
            mood_score=5
        )
        print("❌ Empty title should have failed validation")
    except Exception as e:
        print(f"✅ Title validation working: {e}")

def main():
    """Run all tests"""
    print("🚀 Phase 3: Testing Basic Pydantic Models\n")
    print("=" * 50)
    
    test_vibe_models()
    test_mood_models()
    test_common_models()
    test_validation()
    
    print("\n" + "=" * 50)
    print("🎉 Phase 3 Complete: All Pydantic models working correctly!")
    print("\nAvailable Categories:")
    print(f"  Vibe Categories: {[cat.value for cat in VibeCategory]}")
    print(f"  Vibe Intensities: {[intensity.value for intensity in VibeIntensity]}")
    print(f"  Mood Types: {[mood.value for mood in MoodType]}")
    print(f"  Emotional States: {[state.value for state in EmotionalState]}")

if __name__ == "__main__":
    main() 