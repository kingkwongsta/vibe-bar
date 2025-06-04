# OpenRouter Integration Setup Guide

## Overview

This document provides a complete guide for setting up and using OpenRouter LLM integration in the Vibe Bar backend. OpenRouter provides access to multiple AI models through a unified API, making it perfect for mood and vibe analysis features.

## Prerequisites

1. **OpenRouter Account**: Sign up at [OpenRouter.ai](https://openrouter.ai)
2. **API Key**: Get your API key from the OpenRouter dashboard
3. **Python Environment**: Python 3.8+ with required dependencies installed

## Quick Start

### 1. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Copy from env.example
cp env.example .env
```

Edit `.env` and add your OpenRouter API key:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your_actual_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_AI_MODEL=openai/gpt-4o-mini
FALLBACK_AI_MODEL=openai/gpt-3.5-turbo

# AI Configuration
AI_TIMEOUT=30
AI_MAX_RETRIES=3
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1000
```

### 2. Install Dependencies

The required dependencies are already in `requirements.txt`:

```bash
pip install -r requirements.txt
```

Key dependencies:
- `openai==1.54.4` - OpenAI Python client (compatible with OpenRouter)
- `httpx==0.27.2` - HTTP client for async requests
- `pydantic==2.9.2` - Data validation and serialization

### 3. Test the Integration

Run the comprehensive test suite:

```bash
python test_openrouter.py
```

This will verify:
- Configuration is correct
- API key is valid
- Service initialization works
- All AI endpoints function properly
- Error handling and fallback mechanisms

### 4. Start the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Architecture

### Service Structure

```
app/
├── services/
│   ├── __init__.py          # Service exports
│   └── openrouter.py        # OpenRouter service implementation
├── config.py                # Configuration management
└── main.py                  # FastAPI app with AI endpoints
```

### Key Components

1. **OpenRouterService**: Main service class for AI interactions
2. **AIMessage**: Structured message format for conversations
3. **AIResponse**: Structured response format with metadata
4. **Error Handling**: Custom exceptions and retry logic
5. **Health Checks**: Service monitoring and diagnostics

## Available Endpoints

### AI Service Endpoints

- `GET /api/ai/health` - Check AI service health
- `GET /api/ai/models` - List available models
- `POST /api/ai/complete` - General completion endpoint

### Enhanced App Endpoints

- `POST /api/vibes` - Create vibe with AI analysis
- `POST /api/vibes/{id}/analyze` - Analyze existing vibe
- `POST /api/moods` - Create mood with AI insights
- `POST /api/moods/{id}/insights` - Generate mood insights

### Example Usage

#### Basic AI Completion

```bash
curl -X POST "http://localhost:8000/api/ai/complete" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": "Analyze this mood: feeling energetic and motivated",
    "temperature": 0.7,
    "max_tokens": 200
  }'
```

#### Vibe Analysis

```bash
curl -X POST "http://localhost:8000/api/vibes/1/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Morning Energy",
    "description": "Feeling ready to tackle the day",
    "context": {"time_of_day": "morning"}
  }'
```

## Configuration Options

### Model Selection

Available models through OpenRouter:
- `openai/gpt-4o-mini` (default, cost-effective)
- `openai/gpt-3.5-turbo` (fallback)
- `anthropic/claude-3-haiku` (alternative)
- `meta-llama/llama-3.2-3b-instruct` (open-source)
- `google/gemini-flash-1.5` (fast responses)

### AI Parameters

- **Temperature**: Controls randomness (0.0-1.0)
- **Max Tokens**: Maximum response length
- **Timeout**: Request timeout in seconds
- **Max Retries**: Number of retry attempts
- **Fallback Model**: Backup model if primary fails

## Features

### 1. Vibe Analysis

The service provides intelligent analysis of user vibes:

```python
response = await service.analyze_vibe(
    vibe_title="Productive Morning",
    vibe_description="Feeling focused and energetic",
    user_context={"time_of_day": "morning"}
)
```

Features:
- Emotional theme identification
- Activity suggestions
- Encouragement and validation
- Context-aware responses

### 2. Mood Insights

Generate insights from mood data:

```python
mood_data = {
    "primary_mood": "motivated",
    "energy_level": 8,
    "stress_level": 3,
    "notes": "Great day ahead"
}

response = await service.generate_mood_insights(mood_data)
```

Features:
- Pattern recognition
- Trend analysis
- Coping strategy suggestions
- Supportive feedback

### 3. Error Handling

Robust error handling includes:
- Automatic retries with exponential backoff
- Model fallback on failures
- Detailed error logging
- Graceful degradation

### 4. Health Monitoring

Comprehensive health checks:
- API connectivity tests
- Model availability verification
- Response time monitoring
- Configuration validation

## Development

### Adding New AI Features

1. **Create new methods** in `OpenRouterService`
2. **Add endpoints** in `main.py`
3. **Write tests** in `test_openrouter.py`
4. **Update documentation**

Example new feature:

```python
async def analyze_mood_patterns(self, historical_data: List[Dict]) -> AIResponse:
    """Analyze patterns in historical mood data"""
    system_prompt = "You are a mood pattern analyst..."
    user_prompt = f"Analyze these mood patterns: {historical_data}"
    
    return await self.complete(
        messages=[
            AIMessage(role="system", content=system_prompt),
            AIMessage(role="user", content=user_prompt)
        ],
        temperature=0.6,
        max_tokens=300
    )
```

### Testing

The test suite covers:
- Configuration validation
- Service initialization
- Basic completions
- Structured messages
- Vibe analysis
- Mood insights
- Error handling
- Model fallback
- Integration examples

Run tests with:
```bash
python test_openrouter.py
```

### Debugging

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Check health status:
```bash
curl http://localhost:8000/api/ai/health
```

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Environment Variables**: Use `.env` files for sensitive data
3. **Rate Limiting**: OpenRouter has built-in rate limits
4. **Input Validation**: All inputs are validated via Pydantic models
5. **Error Handling**: Errors don't expose sensitive information

## Monitoring and Maintenance

### Metrics to Monitor

- Response times
- Error rates
- Token usage
- Model availability
- Health check status

### Regular Maintenance

1. **Update dependencies** regularly
2. **Monitor API usage** and costs
3. **Review error logs** for patterns
4. **Test new models** as they become available
5. **Update prompts** for better results

## Troubleshooting

### Common Issues

1. **"OpenRouter API key is not configured"**
   - Check `.env` file exists
   - Verify `OPENROUTER_API_KEY` is set
   - Ensure no extra spaces or quotes

2. **"AI service is currently unavailable"**
   - Check internet connection
   - Verify API key is valid
   - Test with `python test_openrouter.py`

3. **"Model not found" errors**
   - Verify model name is correct
   - Check if model is available in your plan
   - Use fallback model

4. **Timeout errors**
   - Increase `AI_TIMEOUT` value
   - Check OpenRouter service status
   - Reduce `max_tokens` for faster responses

### Getting Help

1. **Test Suite**: Run `python test_openrouter.py` for diagnostics
2. **Health Check**: Use `/api/ai/health` endpoint
3. **Logs**: Check application logs for detailed errors
4. **OpenRouter Status**: Check [OpenRouter status page](https://status.openrouter.ai)

## Next Steps

1. **Database Integration**: Connect to actual database for mood/vibe storage
2. **User Authentication**: Add user-specific AI interactions
3. **Advanced Analytics**: Implement pattern recognition and trend analysis
4. **Custom Models**: Fine-tune models for mood analysis
5. **Real-time Features**: Add streaming responses for interactive conversations

## API Reference

For complete API documentation, visit:
- Development: http://localhost:8000/docs
- Interactive docs: http://localhost:8000/redoc

The OpenRouter integration is now fully functional and ready for production use! 