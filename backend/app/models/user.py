"""
User-related Pydantic models
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class UserBase(BaseModel):
    """Base user model with common fields"""
    model_config = ConfigDict(from_attributes=True)
    
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="User's email address")
    full_name: Optional[str] = Field(None, max_length=100, description="User's full name")


class UserCreate(UserBase):
    """Model for creating a new user"""
    password: str = Field(..., min_length=6, description="User's password")


class UserUpdate(BaseModel):
    """Model for updating user information"""
    model_config = ConfigDict(from_attributes=True)
    
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=6)


class User(UserBase):
    """Full user model with database fields"""
    id: int = Field(..., description="Unique identifier")
    is_active: bool = Field(default=True, description="Whether the user account is active")
    created_at: datetime = Field(..., description="When the user was created")
    updated_at: Optional[datetime] = Field(None, description="When the user was last updated")


class UserResponse(UserBase):
    """Response model for user data (without sensitive info)"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class UserLogin(BaseModel):
    """Model for user login"""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="User's password")


class Token(BaseModel):
    """JWT token response model"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Token expiration time in seconds")


class TokenData(BaseModel):
    """Token payload data"""
    username: Optional[str] = None
    user_id: Optional[int] = None 