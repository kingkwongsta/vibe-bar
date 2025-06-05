# 🍸 Vibe Bar

**AI-Powered Cocktail Recipe Generator**

Vibe Bar is a modern web application that generates personalized cocktail recipes using advanced AI/LLM integration. Instead of browsing static recipe databases, users input their preferences and available ingredients to receive unique, creative cocktail suggestions tailored to their taste and bar inventory.

![Vibe Bar Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Vibe+Bar+Demo)

## 🎯 Product Overview

### Core Value Proposition
Transform your home bartending experience with dynamic, AI-powered cocktail creation that adapts to your preferences, available ingredients, and mood.

### Key Features

#### 🍹 **Smart Recipe Generation**
- Input available spirits, mixers, and ingredients
- Specify flavor preferences (sweet, sour, bitter, spicy, fruity, herbal)
- Choose base spirits or opt for surprise recommendations
- Set strength preferences from light to strong, including non-alcoholic options

#### 👤 **Personalized Experience**
- **My Bar Inventory**: Maintain a persistent list of available ingredients
- **Saved Recipes**: Build your personal cocktail collection
- **Preference Profiles**: Store default flavor and spirit preferences
- **Recipe History**: Access previously generated cocktails

#### 🎨 **Creative AI Output**
- Unique cocktail names for each recipe
- Precise measurements and clear instructions
- Garnish and glassware recommendations
- Difficulty ratings and preparation time estimates

#### 🔄 **Social & Sharing**
- Share recipes via social media, email, or direct links
- Rate and review generated cocktails
- Cross-device synchronization

## 📊 Current Implementation Status

**✅ PHASE 1 COMPLETED - Core MVP:**
- Frontend: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4
- Backend: FastAPI (Python) with OpenRouter AI integration
- Recipe generation functionality working end-to-end
- Frontend-backend API communication established

**🚧 PHASE 2 IN PROGRESS - Database & Auth:**
- Database integration (Supabase recommended)
- User authentication system
- Recipe saving and management
- Enhanced UI/UX features

**📋 PHASE 3 PLANNED - Advanced Features:**
- Social sharing and community features
- Performance optimizations
- SEO and analytics integration

---

## 🏗️ Technical Architecture

### Current Tech Stack ✅

**Frontend**
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **UI Components**: Radix UI primitives

**Backend**
- **API Framework**: FastAPI (Python)
- **AI Integration**: OpenRouter.ai API
- **Data Validation**: Pydantic models
- **Configuration**: Environment variables

### Planned Tech Stack (Phase 2)

**Database & Auth**
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

**Infrastructure**
- **Deployment**: Vercel (frontend) + Backend hosting TBD
- **Performance**: Turbopack (dev) + Next.js compiler (prod)

### Key Integrations

```typescript
// AI Recipe Generation
interface RecipeRequest {
  ingredients: string[]
  flavorProfile: string[]
  baseSpirit: string[]
  strength: 'light' | 'medium' | 'strong' | 'none'
  occasion?: string
  dietaryRestrictions?: string[]
}

interface RecipeResponse {
  name: string
  ingredients: Array<{
    name: string
    amount: string
    unit: string
  }>
  instructions: string[]
  garnish: string
  glassware: string
  description?: string
  estimatedTime: number
  difficulty: 'easy' | 'medium' | 'hard'
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Python 3.8+ for backend
- OpenRouter.ai API key for AI integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibe-bar.git
   cd vibe-bar
   ```

2. **Set up the Frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up the Backend**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   **Backend** (`backend/.env`):
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   ENVIRONMENT=development
   FRONTEND_URL=http://localhost:3000
   DEFAULT_AI_MODEL=openai/gpt-4o-mini
   ```
   
   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. **Start the applications**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.
   API docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

## 📁 Project Structure

```
vibe-bar/
├── frontend/                    # Next.js 15 Frontend
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── context/             # React contexts
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # Radix UI primitives
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and API integration
│   │   ├── api.ts               # FastAPI communication
│   │   ├── validation.ts        # Form validation
│   │   └── utils.ts             # Helper functions
│   ├── store/                   # Zustand state management
│   └── public/                  # Static assets
├── backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration
│   │   ├── models/              # Pydantic models
│   │   │   ├── common.py        # Base models
│   │   │   └── cocktail.py      # Recipe models
│   │   └── services/            # Business logic
│   │       └── openrouter.py    # AI integration
│   ├── requirements.txt         # Python dependencies
│   └── test_*.py                # API tests
└── .cursor/                     # Development documentation
    └── rules/                   # Implementation guides
```

## 🔄 Development Workflow

### Phase 1: Core MVP ✅ (COMPLETED)
- [x] User preference input form
- [x] AI recipe generation via OpenRouter
- [x] Basic recipe display
- [x] FastAPI backend with CORS
- [x] Frontend-backend API communication

### Phase 2: Database & Authentication 🚧 (IN PROGRESS)
- [ ] Supabase database integration
- [ ] User authentication system
- [ ] Recipe saving and management
- [ ] User profile management
- [ ] My Bar inventory system
- [ ] Enhanced ingredient selector with search

### Phase 3: Advanced Features 📋 (PLANNED)
- [ ] Recipe sharing functionality
- [ ] Advanced search and filtering
- [ ] Usage analytics and rate limiting
- [ ] Performance optimizations
- [ ] SEO and social media integration
- [ ] Recipe rating and feedback system

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
# Run unit tests (to be implemented)
npm run test

# Type checking
npx tsc --noEmit
```

### Backend Testing
```bash
cd backend
# Test API endpoints
python test_openrouter.py
python test_cocktail_generation.py

# Test models
python test_models.py
```

## 📊 Performance Targets

### Current Performance ✅
- **Recipe Generation**: 5-15 seconds (OpenRouter AI processing)
- **Frontend Load Time**: <2 seconds with Turbopack
- **API Response Time**: <500ms for non-AI endpoints

### Phase 2 Targets
- **Recipe Generation**: 3-10 seconds (with caching)
- **Page Load Times**: <2 seconds for all pages
- **Mobile Performance**: Lighthouse score >90
- **Accessibility**: WCAG 2.1 AA compliance

## 🔒 Security & Privacy

- Secure API key management for external services
- User data encryption at rest and in transit
- GDPR compliance for user data handling
- Rate limiting to prevent API abuse
- Regular security audits and updates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Roadmap

### Phase 2: Database & User Management (Q1 2024)
- Supabase database integration
- User authentication and profiles
- Recipe saving and collections
- My Bar inventory management

### Phase 3: Enhanced Features (Q2 2024)
- Recipe sharing and social features
- Advanced search and filtering
- Performance optimizations
- Mobile-responsive improvements

### Phase 4: Advanced AI & Integrations (Q3-Q4 2024)
- **Advanced AI**: Image generation, ingredient substitution
- **Community Features**: User-generated collections, ratings
- **Mobile Apps**: Native iOS and Android applications
- **Integrations**: Smart home devices, grocery list APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter.ai](https://openrouter.ai) for AI model access and API
- [Next.js](https://nextjs.org) for the amazing React framework
- [FastAPI](https://fastapi.tiangolo.com) for the high-performance Python API framework
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Radix UI](https://radix-ui.com) for accessible component primitives
- The open-source community for incredible tools and libraries

---

**Built with ❤️ and 🍸 by the Vibe Bar team**

For questions, suggestions, or support, please open an issue or contact us at [hello@vibe-bar.com](mailto:hello@vibe-bar.com). 