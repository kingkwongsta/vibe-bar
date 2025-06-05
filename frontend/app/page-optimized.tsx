import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { HeroSection, PageBackground } from '@/components/layout/hero-section'

// Metadata for the landing page
export const metadata: Metadata = {
  title: "Vibe Bar - Craft Your Perfect Cocktail",
  description: "AI-powered cocktail recipes tailored to your taste, ingredients, and mood. Discover unique drinks you'll love.",
  keywords: ["cocktail generator", "AI bartender", "mixology", "drink recipes"],
}

// Loading fallbacks for streaming
function NavigationLoading() {
  return <div className="h-16 bg-white/95 backdrop-blur-sm border-b animate-pulse" />
}

function FormLoading() {
  return (
    <div className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg p-6">
      <div className="animate-pulse space-y-6">
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  )
}

// Dynamically import client components to reduce initial bundle
const ClientApp = dynamic(
  () => import('@/components/app-with-url-sync').then(mod => ({ default: mod.AppWithUrlSync })),
  {
    loading: () => (
      <PageBackground variant="default">
        <NavigationLoading />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <HeroSection />
          <FormLoading />
        </div>
      </PageBackground>
    ),
    ssr: false, // Client-only for state management
  }
)

// Server component for SEO and initial page structure
export default function OptimizedPage() {
  return (
    <main>
      {/* Critical above-the-fold content rendered on server */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* SEO-optimized static content */}
        <div className="sr-only">
          <h1>Vibe Bar - AI-Powered Cocktail Generator</h1>
          <p>Create personalized cocktail recipes based on your taste preferences, available ingredients, and desired mood. Our AI bartender crafts unique drink recipes just for you.</p>
          <h2>Features:</h2>
          <ul>
            <li>Personalized cocktail recommendations</li>
            <li>Ingredient-based recipe generation</li>
            <li>Mood and vibe matching</li>
            <li>Custom dietary restrictions</li>
          </ul>
        </div>

        {/* Interactive app with streaming */}
        <Suspense
          fallback={
            <PageBackground variant="default">
              <NavigationLoading />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <HeroSection />
                <FormLoading />
              </div>
            </PageBackground>
          }
        >
          <ClientApp />
        </Suspense>
      </div>
    </main>
  )
} 