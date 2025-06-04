"""
Common Pydantic models and utilities
"""

from datetime import datetime, UTC
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field, field_validator


class APIResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool = True
    message: str = "Operation successful"
    data: Optional[Any] = None
    errors: Optional[List[str]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class PaginationParams(BaseModel):
    """Common pagination parameters"""
    page: int = Field(default=1, ge=1, description="Page number")
    per_page: int = Field(default=20, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Field(None, description="Field to sort by")
    sort_order: Optional[str] = Field(default="desc", description="Sort order")
    
    @field_validator('sort_order')
    @classmethod
    def validate_sort_order(cls, v):
        if v not in ['asc', 'desc']:
            raise ValueError('sort_order must be either "asc" or "desc"')
        return v


class FilterParams(BaseModel):
    """Common filtering parameters"""
    start_date: Optional[datetime] = Field(None, description="Filter entries from this date")
    end_date: Optional[datetime] = Field(None, description="Filter entries until this date")
    search: Optional[str] = Field(None, min_length=1, max_length=100, description="Search term")


class HealthCheck(BaseModel):
    """Health check response model"""
    status: str = "healthy"
    service: str = "vibe-bar-api"
    version: str = "0.1.0"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    database_connected: bool = True
    dependencies: Dict[str, bool] = Field(default_factory=dict) 