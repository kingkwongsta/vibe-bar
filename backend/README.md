# Vibe Bar Backend - AI-Powered Drink Recipe Generator

An intelligent drink recipe generation API powered by OpenRouter LLM integration. Generate personalized cocktails, mocktails, coffee drinks, teas, smoothies, and more based on mood, preferences, and context.

## 🍹 Features

### Core Functionality
- **AI-Powered Recipe Generation**: Create unique drink recipes using advanced LLM models
- **Mood-Based Recommendations**: Generate drinks based on user's current or desired mood
- **Multiple Drink Types**: Cocktails, mocktails, coffee, tea, smoothies, juices, hot chocolate, kombucha
- **Personalized Preferences**: Consider flavor profiles, dietary restrictions, skill level, and time constraints
- **Smart Customization**: Modify existing recipes based on user feedback and preferences
- **Food Pairing Suggestions**: AI-generated food pairing recommendations

### Supported Drink Types
- 🍸 **Cocktails**: Classic and creative alcoholic beverages
- 🥤 **Mocktails**: Sophisticated non-alcoholic alternatives  
- ☕ **Coffee**: From simple brews to elaborate specialty drinks
- 🍵 **Tea**: Hot and iced teas with creative combinations
- 🥤 **Smoothies**: Healthy and delicious blended drinks
- 🧃 **Juices**: Fresh and creative juice combinations
- 🍫 **Hot Chocolate**: Comfort drinks and dessert beverages
- 🍾 **Kombucha**: Fermented and health-focused drinks

### Mood Categories
- ⚡ **Energizing**: Drinks to boost energy and motivation
- 😌 **Relaxing**: Calming and soothing beverages
- 🎉 **Celebratory**: Festive drinks for special occasions
- 🤗 **Comforting**: Warm and cozy comfort drinks
- 🌊 **Refreshing**: Cool and revitalizing beverages
- 💕 **Romantic**: Elegant drinks for intimate moments
- 🎯 **Focus**: Drinks to enhance concentration
- 👥 **Social**: Perfect for gatherings and parties

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
python test_drink_generation.py
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

### Core Drink Generation

#### Generate Drink Recipe
```http
POST /api/drinks/generate
```

Generate a custom drink recipe based on preferences:

```json
{
  "mood": "energizing",
  "drink_type": "coffee", 
  "flavor_preferences": ["sweet", "creamy"],
  "time_of_day": "morning",
  "difficulty_preference": "easy",
  "custom_request": "I need something to wake me up and start my productive day"
}
```

#### Quick Generate
```http
POST /api/drinks/quick-generate
```

Simplified endpoint for quick recipe generation with minimal input.

#### Get Recommendations
```http
POST /api/drinks/recommendations
```

Get 3 personalized drink recommendations based on user history and preferences.

### Helper Endpoints

#### Get Available Options
```http
GET /api/drinks/options
```

Returns all available drink types, flavors, moods, and difficulty levels.

#### Health Check
```http
GET /api/ai/health
```

Check if the AI service is working properly.

### Example Requests

#### Energizing Morning Coffee
```json
{
  "mood": "energizing",
  "drink_type": "coffee",
  "flavor_preferences": ["sweet", "creamy"],
  "time_of_day": "morning",
  "custom_request": "I need something to wake me up"
}
```

#### Relaxing Evening Tea
```json
{
  "mood": "relaxing", 
  "drink_type": "tea",
  "flavor_preferences": ["herbal", "floral"],
  "time_of_day": "evening",
  "temperature_preference": "hot"
}
```

#### Celebratory Cocktail
```json
{
  "mood": "celebratory",
  "drink_type": "cocktail", 
  "flavor_preferences": ["fruity", "tropical"],
  "occasion": "birthday party",
  "difficulty_preference": "medium"
}
```

## 🧪 Testing

### Run Drink Generation Tests
```bash
python test_drink_generation.py
```

This comprehensive test suite validates:
- ✅ Configuration and service initialization
- ✅ Basic drink recipe generation
- ✅ Cocktail and mocktail generation
- ✅ Personalized recommendations
- ✅ Multiple drink type variety
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
│   │   ├── drink.py          # Drink recipe data models
│   │   ├── common.py         # Shared API models
│   │   └── __init__.py       # Model exports
│   ├── services/
│   │   ├── openrouter.py     # OpenRouter LLM integration
│   │   ├── drink_service.py  # Drink recipe generation logic
│   │   └── __init__.py       # Service exports
│   ├── config.py             # Configuration management
│   └── main.py               # FastAPI application
├── test_drink_generation.py  # Drink-focused test suite
├── test_openrouter.py        # OpenRouter integration tests
├── requirements.txt          # Python dependencies
├── env.example              # Environment template
└── README.md                # This file
```

### Key Components

#### DrinkRecipeService
The core service that handles:
- Structured prompt creation for LLM
- JSON response parsing and validation
- Recipe customization and recommendations
- Error handling and retry logic

#### OpenRouterService
Manages OpenRouter API integration:
- Multi-model support with fallback
- Retry logic and error handling
- Response parsing and token tracking

#### Data Models
Comprehensive Pydantic models for:
- Recipe ingredients and instructions
- User preferences and requests
- API responses and error handling

## 🎯 Use Cases

### Personal Use
- **Morning Routine**: Generate energizing coffee or tea recipes
- **Evening Wind-down**: Create relaxing herbal teas or warm drinks
- **Healthy Living**: Get nutritious smoothie and juice recipes
- **Skill Building**: Learn new cocktail techniques with guided recipes

### Entertainment
- **Party Planning**: Generate themed cocktails for events
- **Date Nights**: Create romantic drink recipes for two
- **Seasonal Celebrations**: Get holiday-appropriate beverages
- **Creative Exploration**: Discover unique flavor combinations

### Professional Use
- **Bartenders**: Generate creative cocktail ideas
- **Café Owners**: Develop signature drink menus
- **Food Bloggers**: Create content around beverage recipes
- **Nutritionists**: Design healthy drink recommendations

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
- [x] Comprehensive drink recipe data models
- [x] AI-powered recipe generation with structured prompts
- [x] Multiple drink type support (8+ categories)
- [x] Mood-based recipe recommendations
- [x] Personalized preference handling
- [x] Food pairing suggestions
- [x] Comprehensive testing suite
- [x] API documentation and examples

### 🔄 Future Enhancements
- [ ] Recipe persistence and user favorites
- [ ] Image generation for drink recipes
- [ ] Nutritional information calculation
- [ ] Integration with ingredient databases
- [ ] User authentication and profiles
- [ ] Recipe rating and feedback system
- [ ] Seasonal and trending recipe suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `python test_drink_generation.py`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

- **Documentation**: Check `/docs` endpoint when server is running
- **Issues**: Create GitHub issues for bugs or feature requests
- **Testing**: Run test suite to verify functionality
- **OpenRouter**: Check [OpenRouter docs](https://openrouter.ai/docs) for model info

---

🍹 **Happy drink making with Vibe Bar!** Generate the perfect beverage for any mood, moment, or occasion. 