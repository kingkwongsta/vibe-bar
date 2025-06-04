"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavigationBar } from "@/components/layout/navigation-bar"
import {
  Sparkles,
  Clock,
  ChefHat,
  Users,
  Wine,
  Heart,
  Share2,
  Star,
  Zap,
} from "lucide-react"
import type { ViewType } from "@/lib/types"

interface RecipeViewProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

// Recipe Data Configuration
const RECIPE_DATA = {
  title: "Sunset Serenity",
  description: "A vibrant tequila-based cocktail with tropical notes and a gentle spicy kick",
  meta: {
    prepTime: "3 min prep",
    difficulty: "Easy",
    servings: "1 serving"
  },
  ingredients: [
    { name: "Silver Tequila", amount: "2 oz" },
    { name: "Fresh Pineapple Juice", amount: "1 oz" },
    { name: "Fresh Lime Juice", amount: "0.5 oz" },
    { name: "Agave Syrup", amount: "0.25 oz" },
    { name: "Jalapeño Slice", amount: "1 piece" },
    { name: "Tajín (rim)", amount: "For garnish" }
  ],
  instructions: [
    "Rim a rocks glass with Tajín by running a lime wedge around the edge and dipping in the spice blend.",
    "In a shaker, muddle the jalapeño slice gently to release oils without breaking it apart.",
    "Add tequila, pineapple juice, lime juice, and agave syrup to the shaker with ice.",
    "Shake vigorously for 15 seconds and double strain into the prepared glass over fresh ice.",
    "Garnish with a pineapple wedge and lime wheel. Serve immediately."
  ],
  glassware: {
    type: "Rocks glass (old fashioned)",
    garnish: "Pineapple wedge & lime wheel"
  }
}

export function RecipeView({ currentView, setCurrentView }: RecipeViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("landing")} className="mb-4">
            ← Back to Recipe Creator
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">{RECIPE_DATA.title}</CardTitle>
            <CardDescription className="text-lg">
              {RECIPE_DATA.description}
            </CardDescription>

            {/* Recipe Meta */}
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />{RECIPE_DATA.meta.prepTime}
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                {RECIPE_DATA.meta.difficulty}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />{RECIPE_DATA.meta.servings}
              </div>
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
                {RECIPE_DATA.ingredients.map((ingredient, index) => (
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
                {RECIPE_DATA.instructions.map((instruction, index) => (
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

            {/* Glassware & Garnish */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold mb-2">Recommended Glassware</h4>
                <p className="text-gray-700">{RECIPE_DATA.glassware.type}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold mb-2">Perfect Garnish</h4>
                <p className="text-gray-700">{RECIPE_DATA.glassware.garnish}</p>
              </div>
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
              <Button variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Rate Recipe
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("landing")}>
                <Zap className="h-4 w-4 mr-2" />
                Generate Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 