"use client"

import { Card, CardContent } from "@/components/ui/card"
import { NavigationBar } from "@/components/layout/navigation-bar"
import { IngredientSelector } from "@/components/shared/ingredient-selector"
import { FlavorSelector } from "@/components/shared/flavor-selector"
import { VibeSelector } from "@/components/shared/vibe-selector"
import { SpecialRequestsInput } from "@/components/shared/special-requests-input"
import { RecipeGenerationButton } from "@/components/shared/recipe-generation-button"
import { FormErrorDisplay } from "@/components/shared/form-error-display"
import { FormRestorationAlert } from "@/components/shared/form-restoration-alert"

export function LandingView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      {/* Form Restoration Notification */}
      <FormRestorationAlert />

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

        {/* Selection Limits Error */}
        <FormErrorDisplay />

        {/* Main Generation Form */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="space-y-8 mt-4">
            <IngredientSelector />
            <FlavorSelector />
            <VibeSelector />
            <SpecialRequestsInput />
            <RecipeGenerationButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 