"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationBar } from "@/components/layout/navigation-bar"
import {
  Clock,
  ChefHat,
  Users,
  Wine,
  Heart,
  Share2,
  Zap,
  Sparkles,
} from "lucide-react"
import React from "react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"

export function RecipeView() {
  const { setCurrentView, generatedRecipe, resetForm } = useVibeBarContext()
  // Handler for back to recipe creator that resets form
  const handleBackToRecipeCreator = () => {
    resetForm()
    setCurrentView("landing")
  }

  // If no recipe is generated, show a message
  if (!generatedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <NavigationBar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToRecipeCreator} className="mb-4">
              ← Back to Recipe Creator
            </Button>
          </div>
          
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Sparkles className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Recipe Generated</h2>
                <p className="text-gray-600 mb-6">
                  It looks like you haven&apos;t generated a recipe yet. Go back to the recipe creator to make your perfect cocktail!
                </p>
                <Button onClick={handleBackToRecipeCreator} className="bg-amber-600 hover:bg-amber-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create a Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Parse recipe meta data to include icons  
  const recipeMeta = [
    { icon: Clock, text: generatedRecipe.recipeMeta[0]?.text || "Unknown prep time" },
    { icon: ChefHat, text: generatedRecipe.recipeMeta[1]?.text || "Unknown difficulty" },
    { icon: Users, text: generatedRecipe.recipeMeta[2]?.text || "Unknown serving" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToRecipeCreator} className="mb-4">
            ← Back to Recipe Creator
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">{generatedRecipe.recipeTitle}</CardTitle>
            <CardDescription className="text-lg">
              {generatedRecipe.recipeDescription}
            </CardDescription>

            {/* Recipe Meta */}
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
              {recipeMeta.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="flex items-center gap-1">
                    <IconComponent className="h-4 w-4" />
                    {item.text}
                  </div>
                )
              })}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wine className="h-5 w-5 text-amber-600" />
                Ingredients
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {generatedRecipe.recipeIngredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span>{ingredient.name}</span>
                    <span className="font-semibold">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Instructions</h3>
              <div className="space-y-4">
                {generatedRecipe.recipeInstructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Details (Glassware & Garnish) */}
            <div className="grid md:grid-cols-2 gap-6">
              {generatedRecipe.recipeDetails.map((detail, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{detail.title}</h4>
                  <p className="text-gray-700">{detail.content}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button className="bg-red-500 hover:bg-red-600">
                <Heart className="h-4 w-4 mr-2" />
                Save Recipe
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleBackToRecipeCreator} className="ml-auto">
                <Zap className="h-4 w-4 mr-2" />
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 