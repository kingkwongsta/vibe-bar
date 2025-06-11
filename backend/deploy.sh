#!/bin/bash

# Vibe Bar Backend - Google Cloud Run Deployment Script
# Usage: ./deploy.sh [PROJECT_ID] [REGION]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DEFAULT_REGION="us-west2"
SERVICE_NAME="vibe-bar-backend"
MEMORY="1Gi"
CPU="1"
MIN_INSTANCES="0"
MAX_INSTANCES="10"
TIMEOUT="300"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Get project ID
if [ -z "$1" ]; then
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "$PROJECT_ID" ]; then
        print_error "No project ID provided and no default project set."
        echo "Usage: ./deploy.sh [PROJECT_ID] [REGION]"
        exit 1
    fi
    print_warning "Using default project: $PROJECT_ID"
else
    PROJECT_ID="$1"
fi

# Get region
REGION="${2:-$DEFAULT_REGION}"
print_status "Using region: $REGION"

# Set the project
print_status "Setting project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID"

# Enable required APIs
print_status "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Use existing Artifact Registry repository
print_status "Using existing Artifact Registry repository..."
REPOSITORY_URL="us-west2-docker.pkg.dev/backend-services-437402/vibe-bar"

# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker "us-west2-docker.pkg.dev" --quiet

# Build and deploy
print_status "Building and deploying to Cloud Run..."

# Build the image
print_status "Building Docker image..."
IMAGE_URL="$REPOSITORY_URL/$SERVICE_NAME:latest"
gcloud builds submit --tag "$IMAGE_URL" .

# Deploy to Cloud Run
print_status "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_URL" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 8000 \
    --memory "$MEMORY" \
    --cpu "$CPU" \
    --min-instances "$MIN_INSTANCES" \
    --max-instances "$MAX_INSTANCES" \
    --timeout "$TIMEOUT" \
    --set-env-vars "ENVIRONMENT=production"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")

print_success "Deployment completed!"
print_success "Service URL: $SERVICE_URL"
print_status "Health check: $SERVICE_URL/health"
print_status "API docs: $SERVICE_URL/docs"

echo ""
print_warning "Don't forget to:"
echo "1. Set your environment variables in Cloud Run console"
echo "2. Update your frontend FRONTEND_URL to point to: $SERVICE_URL"
echo "3. Test your endpoints" 