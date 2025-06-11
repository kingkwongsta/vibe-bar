# Google Cloud Run Deployment Guide

This guide will help you deploy your Vibe Bar FastAPI backend to Google Cloud Run.

## 🚀 Quick Deploy

If you just want to deploy quickly:

```bash
./deploy.sh YOUR_PROJECT_ID us-central1
```

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI** installed and authenticated
3. **Docker** installed (for local testing)
4. **Project ID** ready

### Install Google Cloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Authenticate with Google Cloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## 🔧 Manual Deployment Steps

### 1. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Build and Push Docker Image

```bash
# Build the image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/vibe-bar-backend

# Or build locally and push
docker build -t gcr.io/YOUR_PROJECT_ID/vibe-bar-backend .
docker push gcr.io/YOUR_PROJECT_ID/vibe-bar-backend
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy vibe-bar-backend \
    --image gcr.io/YOUR_PROJECT_ID/vibe-bar-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8000 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --timeout 300s \
    --set-env-vars ENVIRONMENT=production
```

## 🔐 Environment Variables

Set these in the Google Cloud Console > Cloud Run > Service > Variables & Secrets:

**Required:**
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key

**Optional:**
- `FRONTEND_URL`: Your frontend domain (for CORS)
- `DEFAULT_AI_MODEL`: Default AI model to use
- `AI_TIMEOUT`: AI request timeout (default: 30)
- `AI_MAX_RETRIES`: Max retries for AI requests (default: 3)

### Setting Environment Variables via CLI

```bash
gcloud run services update vibe-bar-backend \
    --region us-central1 \
    --set-env-vars "OPENROUTER_API_KEY=your_key_here,SUPABASE_URL=your_url_here,SUPABASE_ANON_KEY=your_key_here,SUPABASE_SERVICE_KEY=your_key_here,FRONTEND_URL=https://your-frontend-domain.com"
```

## 🔄 CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - id: 'auth'
      uses: 'google-github-actions/auth@v1'
      with:
        credentials_json: '${{ secrets.GCP_SA_KEY }}'
    
    - name: 'Set up Cloud SDK'
      uses: 'google-github-actions/setup-gcloud@v1'
    
    - name: 'Build and Deploy'
      run: |
        cd backend
        gcloud builds submit --config cloudbuild.yaml
```

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://YOUR_SERVICE_URL/health

# API test
curl https://YOUR_SERVICE_URL/api/test

# API documentation
open https://YOUR_SERVICE_URL/docs
```

## 📊 Monitoring and Logging

1. **Cloud Run Logs**: Google Cloud Console > Cloud Run > Service > Logs
2. **Metrics**: Google Cloud Console > Cloud Run > Service > Metrics
3. **Alerts**: Set up alerting for errors and high latency

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Dockerfile syntax
   - Ensure all files are included (check .dockerignore)

2. **Service Won't Start**
   - Check environment variables
   - Verify port 8000 is exposed
   - Check health endpoint

3. **CORS Issues**
   - Update FRONTEND_URL environment variable
   - Check CORS configuration in main.py

4. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity

### Useful Commands:

```bash
# View logs
gcloud run services logs read vibe-bar-backend --region us-central1

# Get service details
gcloud run services describe vibe-bar-backend --region us-central1

# Update environment variables
gcloud run services update vibe-bar-backend \
    --region us-central1 \
    --set-env-vars "KEY=value"

# Delete service
gcloud run services delete vibe-bar-backend --region us-central1
```

## 💰 Cost Optimization

- **CPU**: Only charged when processing requests
- **Memory**: Choose based on your needs (1Gi is usually sufficient)
- **Min instances**: Keep at 0 for cost savings
- **Max instances**: Set reasonable limits to control costs

Expected costs for moderate traffic: **$5-20/month**

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **IAM**: Use least privilege access
3. **CORS**: Restrict to your frontend domain
4. **HTTPS**: Always use HTTPS (Cloud Run provides this)
5. **Secrets**: Use Google Secret Manager for sensitive data

## 📝 Next Steps

After deployment:

1. Update your frontend to use the new backend URL
2. Set up monitoring and alerting
3. Configure custom domain (optional)
4. Set up CI/CD pipeline
5. Test all endpoints thoroughly 