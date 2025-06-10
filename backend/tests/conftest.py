"""
Pytest configuration and shared fixtures for vibe-bar backend tests.
"""

import pytest
from supabase import create_client, Client
from app.config import config


@pytest.fixture
def sample_test_data():
    """Provide sample test data for use across multiple test modules."""
    return {
        "sample_prompt": "Create a refreshing cocktail",
        "expected_fields": ["name", "ingredients", "instructions"],
        "test_timeout": 30
    }


@pytest.fixture
def test_database_service():
    """Provide a database service using service key for testing."""
    from app.services.database import DatabaseService
    
    class TestDatabaseService(DatabaseService):
        def _initialize_client(self) -> None:
            """Initialize test client with service key to bypass RLS."""
            try:
                if not config.validate_supabase_config():
                    self._client = None
                    return
                
                # Always use service key for tests to bypass RLS
                api_key = config.SUPABASE_SERVICE_KEY or config.SUPABASE_ANON_KEY
                
                self._client = create_client(
                    config.SUPABASE_URL, 
                    api_key
                )
            except Exception as e:
                self._client = None
    
    return TestDatabaseService() 