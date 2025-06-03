# Vibe Bar - Next.js 15 Frontend Implementation Guide

## 🏗️ Project Structure

### Next.js 15 App Router Directory Structure
```
vibe-bar/
├── app/                        # App Router directory
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout (Server Component)
│   ├── page.tsx                # Home page (Server Component)
│   ├── loading.tsx             # Global loading UI
│   ├── error.tsx               # Global error UI
│   ├── not-found.tsx           # 404 page
│   │
│   ├── (auth)/                 # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Auth layout
│   │
│   ├── (dashboard)/            # Dashboard route group (authenticated)
│   │   ├── layout.tsx          # Dashboard layout with nav
│   │   ├── recipes/            # Recipe management
│   │   │   ├── page.tsx        # Saved recipes list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx    # Individual recipe view
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   └── loading.tsx     # Recipe loading state
│   │   ├── profile/            # User profile
│   │   │   ├── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── bar/                # My Bar inventory
│   │       └── page.tsx
│   │
│   ├── generate/               # Recipe generation flow
│   │   ├── page.tsx            # Generation form
│   │   ├── loading.tsx         # Generation loading
│   │   └── result/
│   │       ├── page.tsx        # Generated recipe display
│   │       └── [id]/
│   │           └── page.tsx    # Specific result view
│   │
│   ├── api/                    # API routes (minimal usage)
│   │   ├── webhooks/
│   │   │   └── route.ts        # Supabase webhooks
│   │   └── og/                 # Open Graph image generation
│   │       └── route.tsx
│   │
│   └── sitemap.xml             # Auto-generated sitemap
│
├── components/                 # React components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   │
│   ├── forms/                  # Form components
│   │   ├── preferences-form.tsx
│   │   ├── ingredient-selector.tsx
│   │   ├── flavor-selector.tsx
│   │   ├── spirit-selector.tsx
│   │   └── strength-slider.tsx
│   │
│   ├── recipe/                 # Recipe-related components
│   │   ├── recipe-card.tsx
│   │   ├── recipe-list.tsx
│   │   ├── recipe-instructions.tsx
│   │   ├── ingredient-list.tsx
│   │   ├── recipe-actions.tsx
│   │   └── recipe-skeleton.tsx
│   │
│   ├── layout/                 # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── dashboard-nav.tsx
│   │
│   └── providers/              # Context providers
│       ├── auth-provider.tsx
│       ├── theme-provider.tsx
│       └── query-provider.tsx
│
├── lib/                        # Utility libraries
│   ├── actions/                # Server Actions
│   │   ├── recipe-actions.ts
│   │   ├── auth-actions.ts
│   │   ├── profile-actions.ts
│   │   └── bar-actions.ts
│   │
│   ├── db/                     # Database utilities
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   │
│   ├── services/               # External services
│   │   ├── openrouter.ts
│   │   └── analytics.ts
│   │
│   ├── utils.ts                # Utility functions
│   ├── validations.ts          # Zod schemas
│   ├── constants.ts            # App constants
│   └── fonts.ts                # Font configurations
│
├── stores/                     # Zustand stores (client-side only)
│   ├── recipe-store.ts
│   ├── preferences-store.ts
│   └── ui-store.ts
│
├── hooks/                      # Custom React hooks
│   ├── use-recipe.ts
│   ├── use-debounce.ts
│   └── use-local-storage.ts
│
├── types/                      # TypeScript definitions
│   ├── database.ts             # Supabase generated types
│   ├── recipe.ts
│   ├── user.ts
│   └── api.ts
│
├── styles/                     # Styling
│   └── globals.css
│
├── supabase/                   # Supabase configuration
│   ├── config.ts
│   ├── migrations/
│   └── seed.sql
│
├── public/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── manifest.json
│
├── middleware.ts               # Next.js middleware
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🎨 Component Architecture

### 1. Root Layout (`app/layout.tsx`)
```typescript
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vibe Bar - AI Cocktail Generator',
  description: 'Generate personalized cocktail recipes with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

### 2. Server Components (Default Behavior)

#### Recipe Card (`components/recipe/recipe-card.tsx`)
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RecipeActions } from './recipe-actions'
import { IngredientList } from './ingredient-list'
import { RecipeInstructions } from './recipe-instructions'
import type { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  showActions?: boolean
}

// Server Component - renders on server with no JavaScript
export function RecipeCard({ recipe, showActions = true }: RecipeCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{recipe.name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{recipe.difficulty}</Badge>
              <Badge variant="outline">{recipe.estimatedTime} min</Badge>
              <Badge variant="outline">{recipe.glassware}</Badge>
            </div>
          </div>
          {showActions && <RecipeActions recipe={recipe} />}
        </div>
        {recipe.description && (
          <p className="text-muted-foreground mt-2">{recipe.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <IngredientList ingredients={recipe.ingredients} />
        <RecipeInstructions instructions={recipe.instructions} />
        
        {recipe.garnish && (
          <div>
            <h4 className="font-semibold mb-2">Garnish</h4>
            <p className="text-sm text-muted-foreground">{recipe.garnish}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### 3. Client Components (`"use client"`)

#### Preferences Form (`components/forms/preferences-form.tsx`)
```typescript
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateRecipeAction } from '@/lib/actions/recipe-actions'
import { recipePreferencesSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { IngredientSelector } from './ingredient-selector'
import { FlavorSelector } from './flavor-selector'
import { SpiritSelector } from './spirit-selector'
import { StrengthSlider } from './strength-slider'
import type { RecipePreferences } from '@/types/recipe'

export function PreferencesForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<RecipePreferences>({
    resolver: zodResolver(recipePreferencesSchema),
    defaultValues: {
      ingredients: [],
      flavorProfile: [],
      baseSpirit: [],
      strength: 'medium',
      occasion: '',
      dietaryRestrictions: [],
    },
  })

  const onSubmit = async (data: RecipePreferences) => {
    startTransition(async () => {
      const formData = new FormData()
      
      // Convert data to FormData for Server Action
      data.ingredients.forEach(ingredient => 
        formData.append('ingredients', ingredient)
      )
      data.flavorProfile.forEach(flavor => 
        formData.append('flavorProfile', flavor)
      )
      data.baseSpirit.forEach(spirit => 
        formData.append('baseSpirit', spirit)
      )
      formData.append('strength', data.strength)
      if (data.occasion) formData.append('occasion', data.occasion)
      data.dietaryRestrictions.forEach(restriction => 
        formData.append('dietaryRestrictions', restriction)
      )

      const result = await generateRecipeAction(formData)
      
      if (result?.error) {
        // Handle error
        console.error(result.error)
      }
      // Server Action handles redirect on success
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <IngredientSelector control={form.control} />
        <FlavorSelector control={form.control} />
        <SpiritSelector control={form.control} />
        <StrengthSlider control={form.control} />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending}
        >
          {isPending ? 'Generating Recipe...' : 'Generate Recipe'}
        </Button>
      </form>
    </Form>
  )
}
```

#### Recipe Actions (`components/recipe/recipe-actions.tsx`)
```typescript
'use client'

import { useState, useTransition } from 'react'
import { Heart, Share2, BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveRecipeAction, toggleFavoriteAction } from '@/lib/actions/recipe-actions'
import { useToast } from '@/hooks/use-toast'
import type { Recipe } from '@/types/recipe'

interface RecipeActionsProps {
  recipe: Recipe
}

export function RecipeActions({ recipe }: RecipeActionsProps) {
  const [isFavorited, setIsFavorited] = useState(recipe.is_favorite || false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveRecipeAction(recipe)
      if (result.success) {
        toast({
          title: 'Recipe Saved',
          description: 'Added to your recipe collection',
        })
      }
    })
  }

  const handleToggleFavorite = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(recipe.id)
      if (result.success) {
        setIsFavorited(!isFavorited)
        toast({
          title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
        })
      }
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: recipe.name,
        text: `Check out this cocktail recipe: ${recipe.name}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link Copied',
        description: 'Recipe link copied to clipboard',
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isPending}
      >
        <BookmarkPlus className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleFavorite}
        disabled={isPending}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} 
        />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

---

## 🔌 Server Actions Implementation

### Recipe Actions (`lib/actions/recipe-actions.ts`)
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/db/server'
import { callOpenRouterAPI } from '@/lib/services/openrouter'
import { recipePreferencesSchema } from '@/lib/validations'
import type { Recipe } from '@/types/recipe'

export async function generateRecipeAction(formData: FormData) {
  // Get authenticated user
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  // Validate input data
  const preferences = {
    ingredients: formData.getAll('ingredients') as string[],
    flavorProfile: formData.getAll('flavorProfile') as string[],
    baseSpirit: formData.getAll('baseSpirit') as string[],
    strength: formData.get('strength') as string,
    occasion: formData.get('occasion') as string || undefined,
    dietaryRestrictions: formData.getAll('dietaryRestrictions') as string[],
  }

  const validatedPreferences = recipePreferencesSchema.parse(preferences)

  try {
    // Generate recipe using OpenRouter API
    const recipe = await callOpenRouterAPI(validatedPreferences)
    
    // Save generation to history
    const { data: savedGeneration, error: saveError } = await supabase
      .from('generation_history')
      .insert({
        user_id: user.id,
        preferences_input: validatedPreferences,
        generated_recipe: recipe,
        generation_time_ms: Date.now(), // You'd track this properly
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save generation:', saveError)
      // Continue anyway - don't fail the whole operation
    }

    // Redirect to result page
    const resultId = savedGeneration?.id || 'temp'
    redirect(`/generate/result/${resultId}`)
    
  } catch (error) {
    console.error('Recipe generation failed:', error)
    
    // Return error state (will be handled by error boundary)
    throw new Error('Failed to generate recipe. Please try again.')
  }
}

export async function saveRecipeAction(recipe: Recipe) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('saved_recipes')
    .insert({
      user_id: user.id,
      recipe_data: recipe,
      name: recipe.name,
      is_favorite: false,
    })

  if (error) {
    return { success: false, error: 'Failed to save recipe' }
  }

  // Revalidate the saved recipes page
  revalidatePath('/dashboard/recipes')
  
  return { success: true, data }
}

export async function toggleFavoriteAction(recipeId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get current favorite status
  const { data: recipe } = await supabase
    .from('saved_recipes')
    .select('is_favorite')
    .eq('id', recipeId)
    .eq('user_id', user.id)
    .single()

  if (!recipe) {
    return { success: false, error: 'Recipe not found' }
  }

  // Toggle favorite status
  const { error } = await supabase
    .from('saved_recipes')
    .update({ is_favorite: !recipe.is_favorite })
    .eq('id', recipeId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: 'Failed to update favorite status' }
  }

  revalidatePath('/dashboard/recipes')
  
  return { success: true }
}
```

### OpenRouter Service (`lib/services/openrouter.ts`)
```typescript
import type { RecipePreferences, Recipe } from '@/types/recipe'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export async function callOpenRouterAPI(preferences: RecipePreferences): Promise<Recipe> {
  const prompt = buildRecipePrompt(preferences)
  
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Vibe Bar',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are a professional mixologist AI that creates unique, creative cocktail recipes based on user preferences. Always respond with valid JSON matching the specified schema.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No recipe generated')
  }

  try {
    const recipe = JSON.parse(content)
    return validateRecipeResponse(recipe)
  } catch (error) {
    throw new Error('Invalid recipe format received')
  }
}

function buildRecipePrompt(preferences: RecipePreferences): string {
  return `Create a unique cocktail recipe based on these preferences:

Available ingredients: ${preferences.ingredients.join(', ')}
Flavor preferences: ${preferences.flavorProfile.join(', ')}
Base spirits: ${preferences.baseSpirit.join(', ')}
Strength: ${preferences.strength}
${preferences.occasion ? `Occasion: ${preferences.occasion}` : ''}
${preferences.dietaryRestrictions.length > 0 ? `Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}

Please create a creative, unique cocktail recipe that incorporates these preferences. Be creative with the name and ensure all measurements are precise.

Respond with valid JSON in this exact format:
{
  "name": "Creative Cocktail Name",
  "ingredients": [
    {"name": "Ingredient Name", "amount": "2", "unit": "oz"},
    {"name": "Another Ingredient", "amount": "0.5", "unit": "oz"}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "garnish": "Garnish description",
  "glassware": "Glass type",
  "description": "Brief description of the cocktail",
  "estimatedTime": 5,
  "difficulty": "easy"
}`
}

function validateRecipeResponse(recipe: any): Recipe {
  // Add proper validation here using Zod schema
  // For now, basic validation
  if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
    throw new Error('Invalid recipe structure')
  }
  
  return {
    ...recipe,
    id: crypto.randomUUID(), // Generate temporary ID
    created_at: new Date().toISOString(),
  }
}
```

---

## 🎯 Streaming and Suspense

### Result Page with Streaming (`app/generate/result/[id]/page.tsx`)
```typescript
import { Suspense } from 'react'
import { createClient } from '@/lib/db/server'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { RecipeCardSkeleton } from '@/components/recipe/recipe-skeleton'
import { notFound } from 'next/navigation'

interface ResultPageProps {
  params: { id: string }
}

export default function ResultPage({ params }: ResultPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Generated Recipe
        </h1>
        
        <Suspense fallback={<RecipeCardSkeleton />}>
          <RecipeDisplay recipeId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

// Server Component - direct database access
async function RecipeDisplay({ recipeId }: { recipeId: string }) {
  const supabase = createClient()
  
  const { data: generation, error } = await supabase
    .from('generation_history')
    .select('generated_recipe')
    .eq('id', recipeId)
    .single()

  if (error || !generation) {
    notFound()
  }

  const recipe = generation.generated_recipe as Recipe

  return (
    <div className="space-y-6">
      <RecipeCard recipe={recipe} showActions={true} />
      
      {/* Additional actions */}
      <div className="flex justify-center gap-4">
        <form action="/generate">
          <button 
            type="submit"
            className="btn btn-outline"
          >
            Generate Another Recipe
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## 🔧 Configuration Files

### Next.js Configuration (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'vibe-bar.vercel.app'],
    },
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['supabase.co', 'your-supabase-project.supabase.co'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### Middleware (`middleware.ts`)
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/generate/:path*']
}
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}
```

---

## 📦 Dependencies

### Package.json
```json
{
  "name": "vibe-bar",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate-types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.47.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.0",
    "tailwindcss-animate": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 🚀 Development Commands

### Getting Started
```bash
# Create project
npx create-next-app@latest vibe-bar --typescript --tailwind --eslint --app

# Install additional dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zustand zod react-hook-form @hookform/resolvers lucide-react

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card badge skeleton

# Start development server with Turbopack
npm run dev
```

### Database Setup
```bash
# Initialize Supabase
npx supabase init

# Start local Supabase
npx supabase start

# Generate TypeScript types
npm run db:generate-types
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

---

## 🎯 Best Practices

### Server vs Client Components
- **Default to Server Components** for better performance
- Use **Client Components** only when you need:
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - State or lifecycle methods
  - Custom hooks

### Performance Optimization
- Use **Suspense boundaries** for better loading states
- Implement **progressive enhancement** with Server Actions
- Leverage **static generation** for marketing pages
- Use **streaming** for data-heavy pages

### Error Handling
- Implement **error boundaries** at appropriate levels
- Use **try/catch** in Server Actions
- Provide **meaningful error messages** to users
- Log errors for debugging

This implementation guide provides the complete technical foundation for building Vibe Bar with Next.js 15, following modern React patterns and best practices. 