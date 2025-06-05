// Server Component - Static parts rendered on server
import { Suspense } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { HeroSection, PageBackground } from '@/components/layout/hero-section'

// Dynamic imports for client components to reduce bundle size
import dynamic from 'next/dynamic'

// Client components loaded only when needed
const NavigationBarZustand = dynamic(
  () => import('@/components/layout/navigation-bar-zustand').then(mod => ({ default: mod.NavigationBarZustand })),
  {
    loading: () => <div className="h-16 bg-white/95 backdrop-blur-sm border-b animate-pulse" />,
  }
)

const FormSection = dynamic(
  () => import('@/components/shared/form-section-client'),
  {
    loading: () => (
      <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="space-y-8 mt-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  }
)

const FormErrorDisplay = dynamic(
  () => import('@/components/shared/form-error-display').then(mod => ({ default: mod.FormErrorDisplay })),
  {
    loading: () => <div className="h-4" />,
  }
)

const FormRestorationAlert = dynamic(
  () => import('@/components/shared/form-restoration-alert').then(mod => ({ default: mod.FormRestorationAlert })),
  {
    loading: () => <div className="h-4" />,
  }
)

export function LandingViewServer() {
  return (
    <PageBackground variant="default">
      {/* Navigation - Client Component */}
      <Suspense fallback={<div className="h-16 bg-white/95 backdrop-blur-sm border-b" />}>
        <NavigationBarZustand />
      </Suspense>

      {/* Form Restoration Notification - Client Component */}
      <Suspense fallback={<div className="h-4" />}>
        <FormRestorationAlert />
      </Suspense>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Server Component (Static) */}
        <HeroSection />

        {/* Form Errors - Client Component */}
        <Suspense fallback={<div className="h-4" />}>
          <FormErrorDisplay />
        </Suspense>

        {/* Main Form - Client Component with Loading State */}
        <Suspense
          fallback={
            <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="space-y-8 mt-4">
                <div className="animate-pulse space-y-6">
                  {/* Ingredient selector skeleton */}
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Flavor selector skeleton */}
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Generation button skeleton */}
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          }
        >
          <FormSection />
        </Suspense>
      </div>
    </PageBackground>
  )
}

// Metadata for the landing page (can be exported and used in page.tsx)
export const landingMetadata = {
  title: "Vibe Bar - Craft Your Perfect Cocktail",
  description: "AI-powered cocktail recipes tailored to your taste, ingredients, and mood. Discover unique drinks you'll love.",
  keywords: ["cocktail generator", "AI bartender", "mixology", "drink recipes", "cocktail recommendations"],
} 