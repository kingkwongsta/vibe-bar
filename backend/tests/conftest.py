"""
Pytest configuration and shared fixtures for vibe-bar backend tests.
"""

import pytest


@pytest.fixture
def sample_test_data():
    """Provide sample test data for use across multiple test modules."""
    return {
        "sample_prompt": "Create a refreshing cocktail",
        "expected_fields": ["name", "ingredients", "instructions"],
        "test_timeout": 30
    } 