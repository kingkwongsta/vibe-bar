from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create FastAPI app
app = FastAPI(
    title="Vibe Bar API",
    description="Backend API for Vibe Bar - Starting Simple",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", "http://localhost:3000")  # Production URL from env
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to Vibe Bar API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "vibe-bar-api",
        "cors_enabled": True
    }

# Test endpoint for frontend connectivity
@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify frontend can reach backend"""
    return {
        "message": "Backend is reachable from frontend!",
        "timestamp": "2024-12-19",
        "cors_working": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 