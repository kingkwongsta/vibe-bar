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

## 🏗️ Technical Architecture

### Tech Stack

**Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Shadcn UI + Radix UI

**Backend**
- **Database & Auth**: Supabase (PostgreSQL)
- **AI Integration**: OpenRouter.ai API
- **API Layer**: Next.js Server Actions
- **Real-time**: Supabase Realtime

**Infrastructure**
- **Deployment**: Vercel with Edge Runtime
- **Performance**: Turbopack (dev) + Next.js compiler (prod)
- **CDN**: Vercel Edge Network

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
- Supabase account for database and authentication
- OpenRouter.ai API key for AI integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibe-bar.git
   cd vibe-bar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # OpenRouter AI
   OPENROUTER_API_KEY=your_openrouter_api_key
   
   # Next.js
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   ```bash
   # Run database migrations
   npx supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
vibe-bar/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # User dashboard
│   ├── generate/          # Recipe generation
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn)
│   ├── forms/            # Form components
│   └── recipe/           # Recipe-specific components
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client and utilities
│   ├── ai/               # AI integration logic
│   └── utils/            # General utilities
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔄 Development Workflow

### Phase 1: Core MVP ✅
- [x] User preference input form
- [x] AI recipe generation via OpenRouter
- [x] Basic recipe display
- [x] User authentication
- [x] Simple recipe saving

### Phase 2: Enhanced UX 🚧
- [ ] Enhanced ingredient selector with search
- [ ] Visual flavor profile selection
- [ ] Recipe rating and feedback
- [ ] User profile management
- [ ] My Bar inventory system

### Phase 3: Advanced Features 📋
- [ ] Recipe sharing functionality
- [ ] Advanced search and filtering
- [ ] Usage analytics and rate limiting
- [ ] Performance optimizations
- [ ] SEO and social media integration

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 📊 Performance Targets

- **Recipe Generation**: 3-10 seconds (AI processing dependent)
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

### Upcoming Features
- **Community Features**: User-generated content sharing, collections
- **Advanced AI**: Image generation, ingredient substitution suggestions
- **Mobile Apps**: Native iOS and Android applications
- **Integrations**: Smart home devices, grocery list integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenRouter.ai for AI model access
- Supabase for backend infrastructure
- Vercel for deployment platform
- The open-source community for amazing tools and libraries

---

**Built with ❤️ and 🍸 by the Vibe Bar team**

For questions, suggestions, or support, please open an issue or contact us at [hello@vibe-bar.com](mailto:hello@vibe-bar.com). 