"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationBar } from "@/components/layout/navigation-bar"
import {
  Sparkles,
  ChefHat,
  Users,
  Star,
  Zap,
  Plus,
  X,
} from "lucide-react"
import { INGREDIENTS, FLAVOR_PROFILES } from "@/lib/constants"
import type { ViewType } from "@/lib/types"

const ALCOHOL_STRENGTHS = ["Light", "Medium", "Strong", "Non-alcoholic"]
const VIBES = ["Party", "Relaxing", "Celebration", "Date Night"]

interface LandingViewProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredients: string[]
  customIngredientInput: string
  selectedAlcoholStrength: string | null
  selectedVibe: string | null
  toggleIngredient: (ingredient: string) => void
  toggleFlavor: (flavor: string) => void
  addCustomIngredient: () => void
  removeCustomIngredient: (ingredient: string) => void
  setCustomIngredientInput: (input: string) => void
  setAlcoholStrength: (strength: string) => void
  setVibe: (vibe: string) => void
}

export function LandingView({
  currentView,
  setCurrentView,
  selectedIngredients,
  selectedFlavors,
  customIngredients,
  customIngredientInput,
  selectedAlcoholStrength,
  selectedVibe,
  toggleIngredient,
  toggleFlavor,
  addCustomIngredient,
  removeCustomIngredient,
  setCustomIngredientInput,
  setAlcoholStrength,
  setVibe,
}: LandingViewProps) {
  const handleAddCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    addCustomIngredient()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomIngredient()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar currentView={currentView} setCurrentView={setCurrentView} />

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
            AI-powered cocktail recipes tailored to your taste, ingredients, and mood. Discover unique drinks you'll
            love.
          </p>
        </div>

        {/* Main Generation Form */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-amber-600" />
              Generate Your Cocktail
            </CardTitle>
            <CardDescription>Tell us what you have and what you're craving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Available Ingredients */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">What specific ingredients do you want to include?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {INGREDIENTS.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
                    className={`cursor-pointer p-2 text-center justify-center transition-all ${
                      selectedIngredients.includes(ingredient)
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "hover:bg-amber-50 hover:border-amber-300"
                    }`}
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Ingredients Section */}
            <div>
              {/* Custom Ingredient Input */}
              <Input
                type="text"
                placeholder="Add custom ingredients separated by commas (e.g., Aperol, Elderflower Liqueur, Prosecco)"
                value={customIngredientInput}
                onChange={(e) => setCustomIngredientInput(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Flavor Preferences */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">What kind of flavor profile?</Label>
              <div className="flex flex-wrap gap-2">
                {FLAVOR_PROFILES.map((flavor) => (
                  <Badge
                    key={flavor}
                    variant={selectedFlavors.includes(flavor) ? "default" : "outline"}
                    className={`cursor-pointer p-2 transition-all ${
                      selectedFlavors.includes(flavor)
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "hover:bg-orange-50 hover:border-orange-300"
                    }`}
                    onClick={() => toggleFlavor(flavor)}
                  >
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-lg font-semibold mb-4 block">Alcohol Strength</Label>
                <div className="flex flex-wrap gap-2">
                  {ALCOHOL_STRENGTHS.map((strength) => (
                    <Badge
                      key={strength}
                      variant={selectedAlcoholStrength === strength ? "default" : "outline"}
                      className={`cursor-pointer p-2 transition-all ${
                        selectedAlcoholStrength === strength
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "hover:bg-purple-50 hover:border-purple-300"
                      }`}
                      onClick={() => setAlcoholStrength(strength)}
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold mb-4 block">Vibe</Label>
                <div className="flex flex-wrap gap-2">
                  {VIBES.map((vibe) => (
                    <Badge
                      key={vibe}
                      variant={selectedVibe === vibe ? "default" : "outline"}
                      className={`cursor-pointer p-2 transition-all ${
                        selectedVibe === vibe
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => setVibe(vibe)}
                    >
                      {vibe}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Special requests or dietary restrictions</Label>
              <Textarea
                placeholder="e.g., No citrus, make it batch-friendly, surprise me with something unique..."
                className="resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={() => setCurrentView("recipe")}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white py-6 text-lg font-semibold"
            >
              <Zap className="h-5 w-5 mr-2" />
              Generate My Perfect Cocktail
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0">
            <ChefHat className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">10,000+</h3>
            <p className="text-gray-600">Unique recipes generated</p>
          </Card>
          <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">5,000+</h3>
            <p className="text-gray-600">Happy home bartenders</p>
          </Card>
          <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">4.9/5</h3>
            <p className="text-gray-600">Average recipe rating</p>
          </Card>
        </div>
      </div>
    </div>
  )
} 