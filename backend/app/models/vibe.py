"""
Vibe-related Pydantic models
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class VibeCategory(str, Enum):
    """Categories for different types of vibes"""
    WORK = "work"
    PERSONAL = "personal"
    SOCIAL = "social"
    CREATIVE = "creative"
    PHYSICAL = "physical"
    MENTAL = "mental"
    SPIRITUAL = "spiritual"


class VibeIntensity(str, Enum):
    """Intensity levels for vibes"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    INTENSE = "intense"


class VibeBase(BaseModel):
    """Base vibe model with common fields"""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=1, max_length=100, description="Brief title for the vibe")
    description: Optional[str] = Field(None, max_length=500, description="Detailed description of the vibe")
    category: VibeCategory = Field(..., description="Category of the vibe")
    intensity: VibeIntensity = Field(default=VibeIntensity.MEDIUM, description="Intensity level")
    mood_score: int = Field(..., ge=1, le=10, description="Mood score from 1-10")
    tags: List[str] = Field(default_factory=list, description="Tags associated with this vibe")
    
    
class VibeCreate(VibeBase):
    """Model for creating a new vibe entry"""
    pass


class VibeUpdate(BaseModel):
    """Model for updating an existing vibe entry"""
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: Optional[VibeCategory] = None
    intensity: Optional[VibeIntensity] = None
    mood_score: Optional[int] = Field(None, ge=1, le=10)
    tags: Optional[List[str]] = None


class Vibe(VibeBase):
    """Full vibe model with database fields"""
    id: int = Field(..., description="Unique identifier")
    user_id: Optional[int] = Field(None, description="ID of the user who created this vibe")
    created_at: datetime = Field(..., description="When the vibe was created")
    updated_at: Optional[datetime] = Field(None, description="When the vibe was last updated")
    

class VibeResponse(VibeBase):
    """Response model for vibe data"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    
class VibeListResponse(BaseModel):
    """Response model for list of vibes"""
    vibes: List[VibeResponse]
    total: int
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    has_next: bool
    has_prev: bool 