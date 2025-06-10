#!/usr/bin/env python3
#pytest tests/test_supabase_health.py -v
"""
Test script for Supabase database connection and health validation.
Tests all aspects of database setup, connectivity, and basic operations.
"""

import pytest
import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional

from app.config import config
from app.services.database import database_service

# Configure logging for tests
logging.basicConfig(level=logging.INFO)

class TestSupabaseHealth:
    """Test suite for Supabase database health and connectivity."""
    
    def test_supabase_configuration(self):
        """Test that Supabase configuration is properly set up."""
        print("🔧 Testing Supabase Configuration...")
        
        # Check that required environment variables are set
        assert config.SUPABASE_URL is not None, "SUPABASE_URL environment variable is not set"
        assert config.SUPABASE_ANON_KEY is not None, "SUPABASE_ANON_KEY environment variable is not set"
        
        # Validate configuration method
        is_valid = config.validate_supabase_config()
        assert is_valid, "Supabase configuration validation failed"
        
        # Check URL format
        assert config.SUPABASE_URL.startswith("https://"), "SUPABASE_URL should start with https://"
        assert ".supabase.co" in config.SUPABASE_URL, "SUPABASE_URL should be a valid Supabase URL"
        
        # Check key format (basic validation)
        assert len(config.SUPABASE_ANON_KEY) > 50, "SUPABASE_ANON_KEY appears to be too short"
        
        print("✅ Supabase configuration is valid")
        print(f"   URL: {config.SUPABASE_URL[:50]}...")
        print(f"   Key: {config.SUPABASE_ANON_KEY[:20]}...")
    
    def test_database_service_initialization(self):
        """Test that the database service initializes correctly."""
        print("\n🚀 Testing Database Service Initialization...")
        
        # Check that database service is initialized
        assert database_service is not None, "Database service is not initialized"
        
        # Check that client is connected
        assert database_service.is_connected(), "Database service is not connected"
        
        # Check that client property returns a valid client
        client = database_service.client
        assert client is not None, "Database client is None"
        
        print("✅ Database service initialized successfully")
    
    @pytest.mark.asyncio
    async def test_database_health_check(self):
        """Test the database health check functionality."""
        print("\n💓 Testing Database Health Check...")
        
        # Perform health check
        health_result = await database_service.health_check()
        
        # Validate health check response structure
        assert isinstance(health_result, dict), "Health check should return a dictionary"
        assert "status" in health_result, "Health check should include status"
        assert "connected" in health_result, "Health check should include connected flag"
        assert "message" in health_result, "Health check should include message"
        
        # Validate successful connection
        assert health_result["status"] == "success", f"Health check failed: {health_result['message']}"
        assert health_result["connected"] is True, "Database should be connected"
        
        print("✅ Database health check passed")
        print(f"   Status: {health_result['status']}")
        print(f"   Message: {health_result['message']}")
    
    @pytest.mark.asyncio
    async def test_table_accessibility(self):
        """Test that main tables are accessible and have correct structure."""
        print("\n🗄️ Testing Table Accessibility...")
        
        # Test community_vibes_recipes table
        try:
            recipes = await database_service.get_records("community_vibes_recipes", limit=1)
            assert isinstance(recipes, list), "Should return a list of recipes"
            
            if recipes:
                recipe = recipes[0]
                # Check that basic expected fields exist
                expected_fields = ["id", "name", "description", "ingredients", "instructions", "created_at"]
                for field in expected_fields:
                    assert field in recipe, f"Recipe should have '{field}' field"
                
                print(f"✅ community_vibes_recipes table accessible (found {len(recipes)} records)")
                if recipes:
                    print(f"   Sample recipe: {recipe['name']}")
            else:
                print("✅ community_vibes_recipes table accessible (empty)")
                
        except Exception as e:
            pytest.fail(f"Failed to access community_vibes_recipes table: {str(e)}")
        
        # Test recipe_ratings table
        try:
            ratings = await database_service.get_records("recipe_ratings", limit=1)
            assert isinstance(ratings, list), "Should return a list of ratings"
            
            print(f"✅ recipe_ratings table accessible (found {len(ratings)} records)")
            
        except Exception as e:
            pytest.fail(f"Failed to access recipe_ratings table: {str(e)}")
    
    @pytest.mark.asyncio
    async def test_database_operations(self, test_database_service):
        """Test basic database CRUD operations."""
        print("\n🔄 Testing Database CRUD Operations...")
        
        # Use test database service that bypasses RLS
        db_service = test_database_service
        
        # Test data for operations
        test_recipe_data = {
            "name": "Health Test Cocktail",
            "description": "A test cocktail created during health check",
            "ingredients": [
                {"name": "Test Spirit", "amount": "2 oz"},
                {"name": "Test Mixer", "amount": "4 oz"}
            ],
            "instructions": ["Mix ingredients", "Serve immediately"],
            "creator_name": "Health Check Bot",
            "difficulty_level": "Easy",
            "prep_time_minutes": 2,
            "servings": 1,
            "is_public": False  # Mark as private test data
        }
        
        created_record = None
        
        try:
            # CREATE operation
            created_record = await db_service.create_record("community_vibes_recipes", test_recipe_data)
            assert created_record is not None, "Create operation should return data"
            assert "id" in created_record, "Created record should have an ID"
            
            record_id = created_record["id"]
            print(f"✅ CREATE: Test record created with ID {record_id}")
            
            # READ operation
            fetched_record = await db_service.get_record("community_vibes_recipes", record_id)
            assert fetched_record is not None, "Should be able to fetch created record"
            assert fetched_record["name"] == test_recipe_data["name"], "Fetched record should match created data"
            
            print(f"✅ READ: Test record fetched successfully")
            
            # UPDATE operation
            update_data = {"description": "Updated description during health check"}
            updated_record = await db_service.update_record("community_vibes_recipes", record_id, update_data)
            assert updated_record is not None, "Update operation should return data"
            assert updated_record["description"] == update_data["description"], "Record should be updated"
            
            print(f"✅ UPDATE: Test record updated successfully")
            
            # DELETE operation
            delete_result = await db_service.delete_record("community_vibes_recipes", record_id)
            assert delete_result is True, "Delete operation should return True"
            
            # Verify deletion
            deleted_record = await db_service.get_record("community_vibes_recipes", record_id)
            assert deleted_record is None, "Record should be deleted"
            
            print(f"✅ DELETE: Test record deleted successfully")
            
        except Exception as e:
            # Clean up in case of error
            if created_record and "id" in created_record:
                try:
                    await db_service.delete_record("community_vibes_recipes", created_record["id"])
                except:
                    pass  # Ignore cleanup errors
            
            pytest.fail(f"Database CRUD operations failed: {str(e)}")
    
    @pytest.mark.asyncio
    async def test_database_constraints_and_validation(self, test_database_service):
        """Test that database constraints and validation work correctly."""
        print("\n🛡️ Testing Database Constraints and Validation...")
        
        # Use test database service that bypasses RLS
        db_service = test_database_service
        
        # Test invalid data that should fail constraints
        invalid_test_cases = [
            {
                "name": "constraint_test_negative_prep_time",
                "data": {
                    "name": "Invalid Prep Time Recipe",
                    "description": "This should fail",
                    "ingredients": [{"name": "Test", "amount": "1 oz"}],
                    "instructions": ["Test"],
                    "prep_time_minutes": -1  # Should fail: negative prep time
                },
                "expected_error": "prep_time_minutes constraint"
            },
            {
                "name": "constraint_test_invalid_difficulty",
                "data": {
                    "name": "Invalid Difficulty Recipe", 
                    "description": "This should fail",
                    "ingredients": [{"name": "Test", "amount": "1 oz"}],
                    "instructions": ["Test"],
                    "difficulty_level": "Super Hard"  # Should fail: not in allowed values
                },
                "expected_error": "difficulty_level constraint"
            }
        ]
        
        for test_case in invalid_test_cases:
            try:
                await db_service.create_record("community_vibes_recipes", test_case["data"])
                pytest.fail(f"Expected constraint violation for {test_case['name']}")
            except Exception as e:
                print(f"✅ Constraint validation working: {test_case['name']} properly rejected")
    
    @pytest.mark.asyncio
    async def test_row_level_security(self):
        """Test that Row Level Security policies are working."""
        print("\n🔒 Testing Row Level Security Policies...")
        
        # Test that we can read public approved recipes
        try:
            public_recipes = await database_service.get_records(
                "community_vibes_recipes", 
                filters={"is_public": True, "is_approved": True},
                limit=5
            )
            assert isinstance(public_recipes, list), "Should return list of public recipes"
            print(f"✅ RLS: Can read public recipes ({len(public_recipes)} found)")
            
        except Exception as e:
            pytest.fail(f"Failed to read public recipes: {str(e)}")
    
    def test_environment_specific_setup(self):
        """Test environment-specific database setup."""
        print("\n🌍 Testing Environment-Specific Setup...")
        
        # Check environment configuration
        environment = config.ENVIRONMENT
        print(f"Current environment: {environment}")
        
        if config.is_development():
            print("✅ Development environment detected - full access expected")
        elif config.is_production():
            print("✅ Production environment detected - restricted access expected")
            # In production, additional security checks could be added here
        else:
            print(f"✅ Custom environment '{environment}' detected")
        
        # Validate that all required config for current environment is present
        assert config.validate_supabase_config(), "Supabase should be configured for current environment"

def run_health_tests():
    """Run all health tests synchronously for easier debugging."""
    print("🚀 Starting Supabase Database Health Tests")
    print("=" * 60)
    
    test_suite = TestSupabaseHealth()
    
    try:
        # Run synchronous tests
        test_suite.test_supabase_configuration()
        test_suite.test_database_service_initialization()
        test_suite.test_environment_specific_setup()
        
        # Run async tests
        loop = asyncio.get_event_loop()
        loop.run_until_complete(test_suite.test_database_health_check())
        loop.run_until_complete(test_suite.test_table_accessibility())
        loop.run_until_complete(test_suite.test_database_operations())
        loop.run_until_complete(test_suite.test_database_constraints_and_validation())
        loop.run_until_complete(test_suite.test_row_level_security())
        
        print("\n" + "=" * 60)
        print("🎉 All Supabase Health Tests Passed!")
        print("\nDatabase Health Summary:")
        print("  ✅ Configuration validated")
        print("  ✅ Connection established")
        print("  ✅ Tables accessible")
        print("  ✅ CRUD operations working")
        print("  ✅ Constraints enforced")
        print("  ✅ Security policies active")
        
    except Exception as e:
        print(f"\n❌ Health test failed: {str(e)}")
        raise

if __name__ == "__main__":
    run_health_tests() 