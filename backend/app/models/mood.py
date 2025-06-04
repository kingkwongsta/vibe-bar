"""
Mood-related Pydantic models
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class MoodType(str, Enum):
    """Different types of moods"""
    HAPPY = "happy"
    SAD = "sad"
    EXCITED = "excited"
    ANXIOUS = "anxious"
    CALM = "calm"
    FRUSTRATED = "frustrated"
    MOTIVATED = "motivated"
    TIRED = "tired"
    ENERGETIC = "energetic"
    CONTENT = "content"
    OVERWHELMED = "overwhelmed"
    FOCUSED = "focused"


class EmotionalState(str, Enum):
    """Broader emotional states"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"


class MoodBase(BaseModel):
    """Base mood model"""
    model_config = ConfigDict(from_attributes=True)
    
    primary_mood: MoodType = Field(..., description="Primary mood type")
    secondary_moods: List[MoodType] = Field(default_factory=list, description="Additional mood types")
    emotional_state: EmotionalState = Field(..., description="Overall emotional state")
    energy_level: int = Field(..., ge=1, le=10, description="Energy level from 1-10")
    stress_level: int = Field(..., ge=1, le=10, description="Stress level from 1-10")
    notes: Optional[str] = Field(None, max_length=1000, description="Additional notes about the mood")


class MoodCreate(MoodBase):
    """Model for creating a mood entry"""
    pass


class MoodUpdate(BaseModel):
    """Model for updating a mood entry"""
    model_config = ConfigDict(from_attributes=True)
    
    primary_mood: Optional[MoodType] = None
    secondary_moods: Optional[List[MoodType]] = None
    emotional_state: Optional[EmotionalState] = None
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    notes: Optional[str] = Field(None, max_length=1000)


class Mood(MoodBase):
    """Full mood model with database fields"""
    id: int = Field(..., description="Unique identifier")
    user_id: Optional[int] = Field(None, description="ID of the user")
    created_at: datetime = Field(..., description="When the mood was recorded")
    updated_at: Optional[datetime] = Field(None, description="When the mood was last updated")


class MoodResponse(MoodBase):
    """Response model for mood data"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class MoodEntry(BaseModel):
    """Combined mood and vibe entry"""
    model_config = ConfigDict(from_attributes=True)
    
    mood: MoodCreate
    vibe_id: Optional[int] = Field(None, description="Associated vibe ID")
    context: Dict[str, Any] = Field(default_factory=dict, description="Additional context data")


class MoodStats(BaseModel):
    """Mood statistics and analytics"""
    most_common_mood: MoodType
    average_energy_level: float = Field(..., ge=0, le=10)
    average_stress_level: float = Field(..., ge=0, le=10)
    mood_distribution: Dict[str, int] = Field(default_factory=dict)
    emotional_state_distribution: Dict[str, int] = Field(default_factory=dict)
    total_entries: int = Field(..., ge=0)
    date_range: Dict[str, datetime] = Field(default_factory=dict) 