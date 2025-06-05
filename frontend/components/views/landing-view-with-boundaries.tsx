"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { NavigationBar } from "@/components/layout/navigation-bar"
import { IngredientSelector } from "@/components/shared/ingredient-selector"
import { FlavorSelector } from "@/components/shared/flavor-selector"
import { VibeSelector } from "@/components/shared/vibe-selector"
import { SpecialRequestsInput } from "@/components/shared/special-requests-input"
import { RecipeGenerationButton } from "@/components/shared/recipe-generation-button"
import { FormErrorDisplay } from "@/components/shared/form-error-display"
import { FormRestorationAlert } from "@/components/shared/form-restoration-alert"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

// Error fallback for form sections
function FormSectionErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h3 className="text-red-800 font-medium mb-2">Form Section Error</h3>
      <p className="text-red-600 text-sm mb-3">
        There was an issue with this form section. You can try refreshing it or continue with other sections.
      </p>
      <button
        onClick={resetError}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Retry Section
      </button>
    </div>
  )
}

// Memoized form sections for better performance
const MemoizedIngredientSelector = React.memo(IngredientSelector)
const MemoizedFlavorSelector = React.memo(FlavorSelector)
const MemoizedVibeSelector = React.memo(VibeSelector)
const MemoizedSpecialRequestsInput = React.memo(SpecialRequestsInput)
const MemoizedRecipeGenerationButton = React.memo(RecipeGenerationButton)

export const LandingViewWithBoundaries = React.memo(function LandingViewWithBoundaries() {
  // Performance monitoring
  usePerformanceMonitor('LandingView', { logToConsole: process.env.NODE_ENV === 'development' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation with error boundary */}
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('Navigation error:', error, errorInfo)
        }}
      >
        <NavigationBar />
      </ErrorBoundary>

      {/* Form Restoration Notification with error boundary */}
      <ErrorBoundary>
        <FormRestorationAlert />
      </ErrorBoundary>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Craft Your Perfect
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent block">
              Cocktail Experience
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recipes tailored to your taste, ingredients, and mood. Discover unique drinks you&apos;ll
            love.
          </p>
        </div>

        {/* Form Error Display with error boundary */}
        <ErrorBoundary>
          <FormErrorDisplay />
        </ErrorBoundary>

        {/* Main Generation Form with comprehensive error boundaries */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="space-y-8 mt-4">
            {/* Ingredient Selection Section */}
            <ErrorBoundary
              fallback={FormSectionErrorFallback}
              onError={(error, errorInfo) => {
                console.error('Ingredient selector error:', error, errorInfo)
              }}
            >
              <MemoizedIngredientSelector />
            </ErrorBoundary>

            {/* Flavor Selection Section */}
            <ErrorBoundary
              fallback={FormSectionErrorFallback}
              onError={(error, errorInfo) => {
                console.error('Flavor selector error:', error, errorInfo)
              }}
            >
              <MemoizedFlavorSelector />
            </ErrorBoundary>

            {/* Vibe Selection Section */}
            <ErrorBoundary
              fallback={FormSectionErrorFallback}
              onError={(error, errorInfo) => {
                console.error('Vibe selector error:', error, errorInfo)
              }}
            >
              <MemoizedVibeSelector />
            </ErrorBoundary>

            {/* Special Requests Section */}
            <ErrorBoundary
              fallback={FormSectionErrorFallback}
              onError={(error, errorInfo) => {
                console.error('Special requests error:', error, errorInfo)
              }}
            >
              <MemoizedSpecialRequestsInput />
            </ErrorBoundary>

            {/* Recipe Generation Section */}
            <ErrorBoundary
              fallback={FormSectionErrorFallback}
              onError={(error, errorInfo) => {
                console.error('Recipe generation error:', error, errorInfo)
              }}
            >
              <MemoizedRecipeGenerationButton />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}) 