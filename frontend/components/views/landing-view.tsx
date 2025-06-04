"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NavigationBar } from "@/components/layout/navigation-bar"
import { useFormValidation } from "@/hooks/use-form-validation"
import {
  Sparkles,
  ChefHat,
  Users,
  Star,
  Zap,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { INGREDIENTS, FLAVOR_PROFILES, VIBES, ALCOHOL_STRENGTHS } from "@/lib/constants"
import type { ViewType, UserPreferences } from "@/lib/types"

interface LandingViewProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredients: string[]
  customIngredientInput: string
  selectedAlcoholStrength: string | null
  selectedVibe: string | null
  specialRequests: string
  toggleIngredient: (ingredient: string) => void
  toggleFlavor: (flavor: string) => void
  addCustomIngredient: () => void
  removeCustomIngredient: (ingredient: string) => void
  setCustomIngredientInput: (input: string) => void
  setAlcoholStrength: (strength: string) => void
  setVibe: (vibe: string) => void
  updateSpecialRequests: (requests: string) => void
  userPreferences: UserPreferences
  prepareLLMPromptCallback?: () => any
  isFormRestored?: boolean
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
  specialRequests,
  toggleIngredient,
  toggleFlavor,
  addCustomIngredient,
  removeCustomIngredient,
  setCustomIngredientInput,
  setAlcoholStrength,
  setVibe,
  updateSpecialRequests,
  userPreferences,
  prepareLLMPromptCallback,
  isFormRestored = false,
}: LandingViewProps) {
  const {
    validateSpecialRequestsInput,
    validateSelectionLimitsInput,
    validateRecipeGenerationInput,
    getError,
    clearError,
  } = useFormValidation()

  const handleSpecialRequestsChange = (requests: string) => {
    const validation = validateSpecialRequestsInput(requests)
    if (validation.isValid && validation.sanitized !== undefined) {
      updateSpecialRequests(validation.sanitized)
    } else {
      updateSpecialRequests(requests) // Allow typing but show error
    }
  }

  const handleCustomIngredientsChange = (ingredients: string) => {
    clearError('customIngredient')
    const validation = validateSpecialRequestsInput(ingredients) // Use same validation pattern as special requests
    if (!validation.isValid && validation.error) {
      // Set custom ingredient error instead of special requests error
      // We'll handle this through the validation directly
    }
    setCustomIngredientInput(ingredients) // Allow typing and let validation show errors
  }

  const handleIngredientToggle = (ingredient: string) => {
    // Clear selection limit errors when toggling
    clearError('selectionLimits')
    
    const newSelectedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter(i => i !== ingredient)
      : [...selectedIngredients, ingredient]
    
    // Validate after toggle
    validateSelectionLimitsInput(newSelectedIngredients, selectedFlavors)
    toggleIngredient(ingredient)
  }

  const handleFlavorToggle = (flavor: string) => {
    // Clear selection limit errors when toggling
    clearError('selectionLimits')
    
    const newSelectedFlavors = selectedFlavors.includes(flavor)
      ? selectedFlavors.filter(f => f !== flavor)
      : [...selectedFlavors, flavor]
    
    // Validate after toggle
    validateSelectionLimitsInput(selectedIngredients, newSelectedFlavors)
    toggleFlavor(flavor)
  }

  // Function to prepare data for LLM cocktail generation
  const prepareLLMPrompt = () => {
    const validation = validateRecipeGenerationInput({
      selectedIngredients,
      selectedFlavors,
      customIngredients: customIngredientInput.trim() || undefined,
    })
    
    if (!validation.isValid) {
      return null // Don't proceed if validation fails
    }
    
    if (prepareLLMPromptCallback) {
      return prepareLLMPromptCallback()
    }
    
    // Fallback to original logic if callback not provided
    const prompt = {
      ingredients: selectedIngredients.length > 0 ? selectedIngredients : userPreferences.baseSpirits,
      flavors: selectedFlavors.length > 0 ? selectedFlavors : userPreferences.flavorProfiles,
      strength: selectedAlcoholStrength || userPreferences.defaultStrength,
      vibe: selectedVibe || userPreferences.defaultVibe,
      dietaryRestrictions: userPreferences.dietaryRestrictions,
      customIngredients: customIngredientInput.trim() || undefined,
      specialRequests: specialRequests.trim() || undefined,
      userContext: {
        preferredSpirits: userPreferences.baseSpirits,
        preferredFlavors: userPreferences.flavorProfiles,
        preferredVibes: userPreferences.preferredVibes,
        restrictions: userPreferences.dietaryRestrictions
      }
    }
    
    console.log("LLM Prompt Data:", prompt)
    return prompt
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Form Restoration Notification */}
      {isFormRestored && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              We've restored your previous selections. Continue where you left off!
            </AlertDescription>
          </Alert>
        </div>
      )}

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
            Recipes tailored to your taste, ingredients, and mood. Discover unique drinks you'll
            love.
          </p>
        </div>

        {/* Selection Limits Error */}
        {getError('selectionLimits') && (
          <div className="max-w-4xl mx-auto mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getError('selectionLimits')}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Generation Form */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-amber-600" />
              Mix Something Amazing
            </CardTitle>
            <CardDescription>Tell us what you have and what you're craving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Available Ingredients */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Choose ingredients for your recipe? 
                {selectedIngredients.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({selectedIngredients.length} selected)
                  </span>
                )}
              </Label>
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
                    onClick={() => handleIngredientToggle(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Ingredients Section */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Add additional ingredients</Label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Aperol, Elderflower Liqueur, Angostura Bitters"
                  value={customIngredientInput}
                  onChange={(e) => handleCustomIngredientsChange(e.target.value)}
                  className={getError('customIngredient') ? 'border-red-500' : ''}
                  maxLength={100}
                />
                <div className="flex justify-between items-center">
                  {getError('customIngredient') ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getError('customIngredient')}
                    </p>
                  ) : (
                    <div />
                  )}
                  <span className="text-xs text-gray-500">
                    {customIngredientInput.length}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Flavor Preferences */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Choose a flavor profile?
                {selectedFlavors.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({selectedFlavors.length} selected)
                  </span>
                )}
              </Label>
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
                    onClick={() => handleFlavorToggle(flavor)}
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
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "hover:bg-indigo-50 hover:border-indigo-300"
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
              <Label className="text-lg font-semibold mb-4 block">Special Requests</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Any special dietary restrictions, preferences, or requests?"
                  value={specialRequests}
                  onChange={(e) => handleSpecialRequestsChange(e.target.value)}
                  className={getError('specialRequests') ? 'border-red-500' : ''}
                  maxLength={100}
                />
                <div className="flex justify-between items-center">
                  {getError('specialRequests') ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getError('specialRequests')}
                    </p>
                  ) : (
                    <div />
                  )}
                  <span className="text-xs text-gray-500">
                    {specialRequests.length}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe Generation Error */}
            {getError('recipeGeneration') && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{getError('recipeGeneration')}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <div className="text-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold"
                onClick={() => {
                  const prompt = prepareLLMPrompt()
                  if (prompt) {
                    setCurrentView("recipe")
                  }
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My Cocktail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 