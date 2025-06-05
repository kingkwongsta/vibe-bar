# Vibe Bar - Product Requirements Document

## 🎯 Project Overview
**Vibe Bar** is a web application that generates personalized cocktail recipes using AI/LLM integration. Users input preferences and available ingredients to receive unique, creative cocktail suggestions.

**Core Value Proposition**: Dynamic, AI-powered cocktail creation that goes beyond static recipe databases.

---

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5+
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Backend API**: FastAPI (Python) with Pydantic models
- **AI Integration**: OpenRouter.ai API via FastAPI service layer
- **Database**: TBD (Supabase recommended for Phase 2)
- **Authentication**: TBD (to be implemented in Phase 2)
- **Deployment**: Vercel (frontend) + Backend hosting TBD
- **Development**: Turbopack (dev) + Next.js compiler (prod)

---

## 🎯 User Stories & Requirements

### Core User Stories
1. **Recipe Generation**
   - As a home bartender, I want to input the spirits and mixers I have on hand so that I can get a cocktail recipe I can make right now
   - As an adventurous drinker, I want to specify my favorite flavor profiles and get a unique cocktail suggestion I've never tried before
   - As a party host, I want to find refreshing cocktails that can be easily made in batches for my guests

2. **Personalization**
   - As a user, I want to save my favorite recipes so I can easily find them again
   - As a user, I want to maintain a "My Bar" inventory of available ingredients
   - As a user with allergies, I want to exclude specific ingredients from my recipe suggestions

3. **Discovery**
   - As a beginner mixologist, I want clear, step-by-step instructions and difficulty indicators
   - As a user, I want creative cocktail names that make the experience more fun
   - As a user, I want to discover new flavor combinations and ingredients

### Functional Requirements

#### 1. User Preference Input
- **Ingredient Selection**: Multi-select interface for available ingredients
- **Flavor Profiles**: Tags for sweet, sour, bitter, spicy, fruity, herbal preferences
- **Base Spirits**: Selection of vodka, gin, rum, tequila, whiskey, or "surprise me"
- **Strength Preference**: Light, medium, strong, or non-alcoholic options
- **Occasion/Mood**: Optional context like party, relaxing, celebration
- **Dietary Restrictions**: Allergy and dietary preference inputs

#### 2. AI Recipe Generation
- **Creative Cocktail Names**: Unique, fitting names for each recipe
- **Precise Measurements**: Clear ingredient quantities and units
- **Step-by-step Instructions**: Easy-to-follow preparation steps
- **Garnish Suggestions**: Appropriate garnish recommendations
- **Glassware Recommendations**: Suggested serving vessel
- **Recipe Metadata**: Prep time, difficulty level, serving size options

#### 3. Recipe Management
- **Save/Favorite**: Personal recipe collection
- **Share Functionality**: Social media, email, or direct link sharing
- **Rating System**: 1-5 star rating for generated recipes
- **Recipe History**: View previously generated cocktails
- **Search & Filter**: Find saved recipes by ingredients, name, or tags

#### 4. User Account Features
- **Profile Management**: User preferences and settings
- **My Bar Inventory**: Persistent ingredient storage
- **Default Preferences**: Saved spirit and flavor preferences
- **Cross-device Sync**: Access saved recipes across devices

---

## 📊 Database Schema

### Core Tables (Supabase PostgreSQL)
```sql
-- User Profiles
profiles (
  id: uuid (references auth.users)
  created_at: timestamp
  username: text
  my_bar_inventory: jsonb
  default_preferences: jsonb
  subscription_tier: text default 'free'
)

-- Saved Recipes
saved_recipes (
  id: uuid
  user_id: uuid (references profiles.id)
  recipe_data: jsonb
  name: text
  created_at: timestamp
  is_favorite: boolean
  tags: text[]
)

-- Recipe Generation History
generation_history (
  id: uuid
  user_id: uuid (references profiles.id)
  preferences_input: jsonb
  generated_recipe: jsonb
  created_at: timestamp
  user_rating: integer (1-5)
  generation_time_ms: integer
)

-- Usage Tracking
usage_tracking (
  id: uuid
  user_id: uuid (references profiles.id)
  action_type: text
  created_at: timestamp
  metadata: jsonb
)
```

---

## 🔌 API Specifications

### OpenRouter Integration
```typescript
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

### Supabase Services
- **Authentication**: Email/password, social logins
- **Database**: Recipe and user data storage
- **Real-time**: Live updates for collaborative features
- **Storage**: Recipe images (future feature)

---

## 🚀 Development Phases

### Phase 1: Core MVP ✅ (COMPLETED)
**Goal**: Basic recipe generation functionality

**Features:**
- ✅ User preference input form
- ✅ AI recipe generation via OpenRouter
- ✅ Basic recipe display
- ✅ Frontend-backend API communication
- ❌ User authentication (moved to Phase 2)
- ❌ Recipe saving (moved to Phase 2)

**Success Criteria:**
- ✅ User can generate and view cocktail recipes
- ✅ Basic error handling and loading states
- ✅ FastAPI backend serving recipe generation
- ❌ Authentication flow (deferred to Phase 2)

### Phase 2: Database & Authentication (Current)
**Goal**: Add persistence and user management

**Features:**
- Database integration (Supabase recommended)
- User authentication system
- Recipe saving and management
- User profile management
- My Bar inventory system
- Enhanced ingredient selector with search

**Success Criteria:**
- User registration and login
- Persistent user preferences
- Recipe management features
- Database schema implementation

### Phase 3: Advanced Features (Week 4+)
**Goal**: Production-ready application

**Features:**
- Recipe sharing functionality
- Advanced search and filtering
- Usage analytics and rate limiting
- Performance optimizations
- SEO and social media integration

**Success Criteria:**
- Production deployment ready
- Social sharing features
- Performance benchmarks met

---

## 📈 Success Metrics

### Key Performance Indicators
- **Recipe Generation Success Rate**: >95% successful generations
- **User Engagement**: Average 3+ recipes generated per session
- **Recipe Save Rate**: >40% of generated recipes saved
- **User Retention**: >60% return within 7 days
- **Performance**: <3 seconds average recipe generation time

### User Experience Metrics
- **Form Completion Rate**: >80% of users complete preferences form
- **Error Rate**: <5% of recipe generations fail
- **Session Duration**: Average 5+ minutes per session
- **Feature Adoption**: >70% of users save at least one recipe

---

## 🔒 Non-Functional Requirements

### Performance
- Recipe generation: 3-10 seconds (dependent on AI processing)
- Page load times: <2 seconds for all pages
- Mobile responsiveness: Support for all device sizes
- Offline capability: Cached recipes viewable offline

### Security
- Secure API key management for OpenRouter
- User data encryption at rest and in transit
- GDPR compliance for user data handling
- Rate limiting to prevent API abuse

### Scalability
- Support for 1000+ concurrent users
- Database query optimization
- CDN integration for static assets
- Auto-scaling infrastructure on Vercel

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast standards

---

## 🎨 Design Requirements

### Visual Design
- **Modern, Clean Aesthetic**: Minimalist interface with focus on content
- **Color Scheme**: Sophisticated palette reflecting cocktail culture
- **Typography**: Readable fonts with clear hierarchy
- **Imagery**: High-quality cocktail photography when available

### User Experience
- **Intuitive Navigation**: Clear paths to all major features
- **Progressive Disclosure**: Complex features revealed as needed
- **Responsive Design**: Seamless experience across devices
- **Loading States**: Clear feedback during AI processing

### Brand Guidelines
- **Tone**: Approachable, sophisticated, creative
- **Voice**: Knowledgeable but not intimidating
- **Personality**: Encouraging exploration and creativity

---

## 🔮 Future Roadmap

### Phase 4: Community Features
- User-generated content sharing
- Recipe collections and curations
- Social features and following
- Community ratings and reviews

### Phase 5: Advanced AI Features
- Image generation for cocktail visualization
- Ingredient substitution suggestions
- Personalized recommendations based on history
- Seasonal and trending recipe suggestions

### Phase 6: Mobile & Extensions
- Native mobile applications (iOS/Android)
- Browser extension for quick access
- Integration with smart home devices
- Grocery list integration

---

## ❓ Open Questions & Considerations

### Technical
- Which OpenRouter models to prioritize for cost/quality balance?
- Rate limiting strategy for free vs premium users?
- Caching strategy for frequently requested recipes?

### Business
- Freemium model structure and premium features?
- Partnership opportunities with liquor brands?
- Monetization strategy beyond subscriptions?

### User Experience
- Onboarding flow for new users?
- Gamification elements to increase engagement?
- Community moderation approach?

---

## 📋 Next Steps

1. **Technical Setup**: Initialize Next.js project with required dependencies
2. **Database Design**: Set up Supabase with defined schema
3. **Core Development**: Build Phase 1 features following frontend implementation guide
4. **Testing**: Implement testing strategy for critical user flows
5. **Deployment**: Set up CI/CD pipeline and production environment

For detailed implementation instructions, see `frontend.md`.