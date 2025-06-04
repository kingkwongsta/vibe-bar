# Vibe Bar Backend - AI-Powered Cocktail Recipe Generator

An intelligent cocktail recipe generation API powered by OpenRouter LLM integration. Generate personalized cocktails and mocktails based on spirits, flavor preferences, occasions, and available ingredients.

## 🍸 Features

### Core Functionality
- **AI-Powered Cocktail Generation**: Create unique cocktail recipes using advanced LLM models
- **Cocktail & Mocktail Support**: Generate both alcoholic cocktails and non-alcoholic mocktails
- **Spirit-Based Creation**: Customize recipes based on preferred base spirits (gin, whiskey, rum, etc.)
- **Occasion-Aware Recipes**: Generate cocktails appropriate for parties, date nights, celebrations, etc.
- **Batch Cocktail Optimization**: Scale recipes for large gatherings and parties
- **Smart Customization**: Modify existing recipes based on user feedback and preferences
- **Food Pairing Suggestions**: AI-generated food pairing recommendations
- **Professional Techniques**: Include proper mixing techniques and glassware suggestions

### Supported Cocktail Types
- 🍸 **Cocktails**: Classic and creative alcoholic beverages with various base spirits
- 🥤 **Mocktails**: Sophisticated non-alcoholic alternatives with complex flavors

### Base Spirits
- 🥃 **Whiskey & Bourbon**: From smooth sipping to bold mixing spirits
- 🍸 **Gin**: Classic London dry to contemporary botanical blends
- 🥃 **Rum**: Light, dark, spiced, and aged varieties
- 🌵 **Tequila & Mezcal**: Agave-based spirits for unique flavor profiles
- 🥃 **Vodka**: Clean and neutral base for fruit-forward cocktails
- 🍷 **Brandy**: Sophisticated spirit for elegant cocktails

### Occasion Categories
- 🎉 **Party**: Fun, easy-to-make crowd-pleasers
- 💕 **Date Night**: Romantic and sophisticated cocktails
- 😌 **Relaxing**: Smooth, calming evening drinks
- 🎊 **Celebration**: Festive cocktails for special occasions
- 🍽️ **Aperitif**: Light, appetite-stimulating pre-dinner drinks
- 🍫 **Digestif**: Rich, settling after-dinner cocktails
- ☀️ **Summer**: Refreshing warm-weather cocktails
- ❄️ **Winter**: Warming, cozy cold-weather drinks
- 🥂 **Brunch**: Morning and afternoon appropriate cocktails

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- OpenRouter API key

### Installation

1. **Clone and navigate to backend**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment**:
```bash
cp env.example .env
# Edit .env with your OpenRouter API key
```

5. **Start the server**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. **Test the setup**:
```bash
python test_cocktail_generation.py
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file based on `env.example`:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_AI_MODEL=openai/gpt-4o-mini
FALLBACK_AI_MODEL=openai/gpt-3.5-turbo

# AI Settings
AI_TEMPERATURE=0.8
AI_MAX_TOKENS=1500
AI_TIMEOUT=30
AI_MAX_RETRIES=3

# Environment
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
```

### OpenRouter Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Generate an API key
3. Add credits to your account
4. Configure the `OPENROUTER_API_KEY` in your `.env` file

## 📡 API Endpoints

### Core Cocktail Generation

#### Generate Cocktail Recipe
```http
POST /api/cocktails/generate
```

Generate a custom cocktail recipe based on preferences:

```json
{
  "base_spirit": "gin",
  "cocktail_type": "cocktail", 
  "flavor_preferences": ["herbal", "citrusy"],
  "strength": "medium",
  "occasion": "date_night",
  "difficulty_preference": "medium",
  "custom_request": "A sophisticated gin cocktail with classic appeal"
}
```

#### Quick Generate
```http
POST /api/cocktails/quick-generate
```

Simplified endpoint for quick cocktail generation with minimal input.

#### Get Recommendations
```http
POST /api/cocktails/recommendations
```

Get 3 personalized cocktail recommendations based on user preferences and bar inventory.

#### Batch Cocktails
```http
POST /api/cocktails/batch
```

Generate cocktail recipes optimized for batch preparation (parties, events).

### Helper Endpoints

#### Get Available Options
```http
GET /api/cocktails/options
```

Returns all available spirits, flavors, occasions, and difficulty levels.

#### Health Check
```http
GET /api/ai/health
```

Check if the AI service is working properly.

### Example Requests

#### Classic Gin Cocktail
```json
{
  "base_spirit": "gin",
  "flavor_preferences": ["herbal", "citrusy"],
  "strength": "medium",
  "difficulty_preference": "medium",
  "custom_request": "Something classic but with a modern twist"
}
```

#### Party Batch Cocktail
```json
{
  "base_spirit": "vodka",
  "cocktail_type": "cocktail",
  "flavor_preferences": ["fruity", "refreshing"],
  "occasion": "party",
  "batch_size": 8,
  "custom_request": "Easy to make in large quantities"
}
```

#### Romantic Mocktail
```json
{
  "cocktail_type": "mocktail",
  "flavor_preferences": ["floral", "sweet"],
  "occasion": "date_night",
  "strength": "none",
  "custom_request": "Something elegant and romantic for a special evening"
}
```

#### Summer Refresher
```json
{
  "base_spirit": "rum",
  "flavor_preferences": ["tropical", "citrusy"],
  "occasion": "summer",
  "strength": "light",
  "custom_request": "Perfect for hot weather and outdoor gatherings"
}
```

## 🧪 Testing

### Run Cocktail Generation Tests
```bash
python test_cocktail_generation.py
```

This comprehensive test suite validates:
- ✅ Configuration and service initialization
- ✅ Classic cocktail recipe generation (gin-based)
- ✅ Rum cocktail generation with tropical flavors
- ✅ Mocktail generation for non-alcoholic options
- ✅ Personalized recommendations based on preferences
- ✅ Batch cocktail generation for parties
- ✅ Multiple spirit variety testing
- ✅ Edge cases and error handling

### Run Basic OpenRouter Tests
```bash
python test_openrouter.py
```

### Manual API Testing
Visit the interactive API documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Architecture

### Project Structure
```
backend/
├── app/
│   ├── models/
│   │   ├── cocktail.py       # Cocktail recipe data models
│   │   ├── common.py         # Shared API models
│   │   └── __init__.py       # Model exports
│   ├── services/
│   │   ├── openrouter.py     # OpenRouter LLM integration
│   │   ├── cocktail_service.py # Cocktail recipe generation logic
│   │   └── __init__.py       # Service exports
│   ├── config.py             # Configuration management
│   └── main.py               # FastAPI application
├── test_cocktail_generation.py # Cocktail-focused test suite
├── test_openrouter.py        # OpenRouter integration tests
├── requirements.txt          # Python dependencies
├── env.example              # Environment template
└── README.md                # This file
```

### Key Components

#### CocktailRecipeService
The core service that handles:
- Structured prompt creation for cocktail-focused LLM responses
- JSON response parsing and validation for cocktail recipes
- Recipe customization and personalized recommendations
- Batch preparation optimization
- Professional mixology technique integration

#### OpenRouterService
Manages OpenRouter API integration:
- Multi-model support with fallback (GPT-4o-mini → GPT-3.5-turbo)
- Retry logic and error handling
- Response parsing and token tracking
- Optimized for cocktail recipe generation

#### Data Models
Comprehensive Pydantic models for:
- Cocktail ingredients, techniques, and instructions
- Base spirits, flavor profiles, and strength levels
- User preferences and bar inventory
- API responses and error handling

## 🎯 Use Cases

### Home Bartending
- **Spirit Exploration**: Discover new cocktails based on available spirits
- **Skill Development**: Progress from easy to advanced cocktail techniques
- **Bar Inventory**: Generate recipes using available ingredients
- **Occasion Planning**: Create appropriate cocktails for different events

### Entertainment
- **Party Planning**: Generate batch cocktails for large gatherings
- **Date Nights**: Create romantic and sophisticated cocktail experiences
- **Seasonal Celebrations**: Get holiday and season-appropriate recipes
- **Creative Exploration**: Discover unique flavor combinations and techniques

### Professional Use
- **Bartenders**: Generate creative cocktail ideas and variations
- **Restaurant/Bar Owners**: Develop signature cocktail menus
- **Food Bloggers**: Create content around cocktail recipes and pairings
- **Event Planners**: Design cocktail programs for special events

## 🔬 Technology Stack

- **FastAPI**: Modern, fast web framework for APIs
- **Pydantic**: Data validation using Python type annotations
- **OpenRouter**: Access to multiple LLM models (GPT-4, Claude, etc.)
- **OpenAI SDK**: Industry-standard LLM integration
- **AsyncIO**: Asynchronous programming for performance
- **Uvicorn**: Lightning-fast ASGI server

## 🚦 Development Status

### ✅ Completed Features
- [x] OpenRouter LLM integration with retry logic
- [x] Comprehensive cocktail recipe data models
- [x] AI-powered cocktail generation with mixologist prompts
- [x] Multiple base spirit support (8+ categories)
- [x] Occasion-based recipe recommendations
- [x] Personalized preference handling
- [x] Food pairing suggestions
- [x] Batch cocktail optimization
- [x] Professional technique integration
- [x] Comprehensive testing suite
- [x] API documentation and examples

### 🔄 Future Enhancements
- [ ] Recipe persistence and user favorites
- [ ] Cocktail image generation
- [ ] Nutritional and alcohol content calculation
- [ ] Integration with ingredient and spirit databases
- [ ] User authentication and cocktail collections
- [ ] Recipe rating and feedback system
- [ ] Seasonal and trending cocktail suggestions
- [ ] My Bar inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `python test_cocktail_generation.py`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

- **Documentation**: Check `/docs` endpoint when server is running
- **Issues**: Create GitHub issues for bugs or feature requests
- **Testing**: Run test suite to verify functionality
- **OpenRouter**: Check [OpenRouter docs](https://openrouter.ai/docs) for model info

---

🍸 **Happy cocktail making with Vibe Bar!** Generate the perfect cocktail for any spirit, occasion, or mood. 