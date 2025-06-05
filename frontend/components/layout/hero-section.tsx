// Server Component - No "use client" directive needed
import React from 'react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  gradient?: string
}

export function HeroSection({ 
  title = "Craft Your Perfect Cocktail Experience",
  subtitle = "Recipes tailored to your taste, ingredients, and mood. Discover unique drinks you'll love.",
  gradient = "from-amber-600 to-orange-500"
}: HeroSectionProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        {title.includes('Cocktail') ? (
          <>
            Craft Your Perfect
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent block`}>
              Cocktail Experience
            </span>
          </>
        ) : (
          <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </span>
        )}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
}

// Server component for recipe hero
export function RecipeHeroSection({ recipeName }: { recipeName?: string }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
        {recipeName ? (
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            {recipeName}
          </span>
        ) : (
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            Your Recipe
          </span>
        )}
      </h1>
    </div>
  )
}

// Server component for page backgrounds
export function PageBackground({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode
  variant?: 'default' | 'recipe' | 'profile' | 'saved'
}) {
  const getBackgroundClasses = () => {
    switch (variant) {
      case 'recipe':
        return 'min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'
      case 'profile':
        return 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      case 'saved':
        return 'min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'
      default:
        return 'min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'
    }
  }

  return (
    <div className={getBackgroundClasses()}>
      {children}
    </div>
  )
} 