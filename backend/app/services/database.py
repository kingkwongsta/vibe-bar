"""
Supabase database service for Vibe Bar API.
Handles database connections and operations for Community Vibes recipes.
"""

import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.config import config

logger = logging.getLogger(__name__)

class DatabaseService:
    """Service for handling Supabase database operations."""
    
    def __init__(self):
        """Initialize the database service with Supabase client."""
        self._client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize the Supabase client."""
        try:
            if not config.validate_supabase_config():
                logger.warning("Supabase configuration is incomplete. Database operations will be disabled.")
                return
            
            # Use service key for testing/development, anon key for production
            api_key = config.SUPABASE_ANON_KEY
            if config.is_development() and config.SUPABASE_SERVICE_KEY:
                api_key = config.SUPABASE_SERVICE_KEY
                logger.info("Using service key for development environment")
            
            self._client = create_client(
                config.SUPABASE_URL, 
                api_key
            )
            logger.info("Supabase client initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {str(e)}")
            self._client = None
    
    @property
    def client(self) -> Optional[Client]:
        """Get the Supabase client instance."""
        return self._client
    
    def is_connected(self) -> bool:
        """Check if the database connection is available."""
        return self._client is not None
    
    async def health_check(self) -> Dict[str, Any]:
        """Perform a health check on the database connection."""
        if not self.is_connected():
            return {
                "status": "error",
                "message": "Database client not initialized",
                "connected": False
            }
        
        try:
            # Try a simple query to test the connection
            response = self._client.table("community_vibes_recipes").select("id").limit(1).execute()
            return {
                "status": "success",
                "message": "Database connection healthy",
                "connected": True
            }
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            return {
                "status": "error",
                "message": f"Database health check failed: {str(e)}",
                "connected": False
            }
    
    async def create_record(self, table_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record in the specified table."""
        if not self.is_connected():
            raise Exception("Database client not initialized")
        
        try:
            response = self._client.table(table_name).insert(data).execute()
            if response.data:
                logger.info(f"Successfully created record in {table_name}")
                return response.data[0]
            else:
                raise Exception("No data returned from insert operation")
        except Exception as e:
            logger.error(f"Failed to create record in {table_name}: {str(e)}")
            raise
    
    async def get_record(self, table_name: str, record_id: str) -> Optional[Dict[str, Any]]:
        """Get a record by ID from the specified table."""
        if not self.is_connected():
            raise Exception("Database client not initialized")
        
        try:
            response = self._client.table(table_name).select("*").eq("id", record_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to get record from {table_name}: {str(e)}")
            raise
    
    async def get_records(self, table_name: str, filters: Optional[Dict[str, Any]] = None, 
                         limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get multiple records from the specified table with optional filters."""
        if not self.is_connected():
            raise Exception("Database client not initialized")
        
        try:
            query = self._client.table(table_name).select("*")
            
            # Apply filters if provided
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            # Apply limit if provided
            if limit:
                query = query.limit(limit)
            
            response = query.execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to get records from {table_name}: {str(e)}")
            raise
    
    async def update_record(self, table_name: str, record_id: str, 
                           data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a record by ID in the specified table."""
        if not self.is_connected():
            raise Exception("Database client not initialized")
        
        try:
            response = self._client.table(table_name).update(data).eq("id", record_id).execute()
            if response.data:
                logger.info(f"Successfully updated record in {table_name}")
                return response.data[0]
            else:
                raise Exception("No data returned from update operation")
        except Exception as e:
            logger.error(f"Failed to update record in {table_name}: {str(e)}")
            raise
    
    async def delete_record(self, table_name: str, record_id: str) -> bool:
        """Delete a record by ID from the specified table."""
        if not self.is_connected():
            raise Exception("Database client not initialized")
        
        try:
            response = self._client.table(table_name).delete().eq("id", record_id).execute()
            logger.info(f"Successfully deleted record from {table_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete record from {table_name}: {str(e)}")
            raise

# Global database service instance
database_service = DatabaseService() 