"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { generateCocktailRecipe, saveCocktailRecipe } from "@/lib/api"
import { useSelectedLLM } from "@/components/debug/llm-switcher"
import type { UserPreferences as ApiUserPreferences } from "@/lib/api"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"
import { useFormValidation } from "@/hooks/use-form-validation"

export function RecipeGenerationButton() {
  const {
    setCurrentView,
    selectedIngredients,
    selectedFlavors,
    customIngredientInput,
    selectedVibe,
    specialRequests,
    userPreferences,
    setGeneratedRecipe,
  } = useVibeBarContext()

  const {
    validateRecipeGenerationInput,
    getError,
  } = useFormValidation()

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const selectedLLM = useSelectedLLM()

  // Function to handle recipe generation via API
  const handleGenerateRecipe = async () => {
    // Clear any previous errors
    setApiError(null)
    setSaveStatus(null)
    
    // Validate form inputs
    const validation = validateRecipeGenerationInput({
      selectedIngredients,
      selectedFlavors,
      customIngredients: customIngredientInput.trim() || undefined,
    })
    
    if (!validation.isValid) {
      return // Validation errors will be displayed by the form validation hook
    }

    setIsGenerating(true)

    try {
      // Prepare the preferences object for the API
      const preferences: ApiUserPreferences = {
        ingredients: selectedIngredients.length > 0 ? selectedIngredients : userPreferences.baseSpirits,
        customIngredients: customIngredientInput.trim() || undefined,
        flavors: selectedFlavors.length > 0 ? selectedFlavors : userPreferences.flavorProfiles,
        vibe: selectedVibe || userPreferences.defaultVibe,
        specialRequests: specialRequests.trim() || undefined,
        model: selectedLLM, // Include the selected LLM model
      }

      console.log('Generating recipe with preferences:', preferences)
      console.log(`🤖 Using LLM model: ${selectedLLM}`)

      // Call the API to generate recipe
      const response = await generateCocktailRecipe(preferences)

      if (response.success && response.data) {
        // Set the generated recipe in context
        setGeneratedRecipe(response.data)
        
        // Save the recipe to database
        setIsSaving(true)
        setSaveStatus('Saving recipe...')
        
        try {
          const saveResponse = await saveCocktailRecipe({
            recipe: response.data,
            preferences: preferences,
            creator: {
              name: 'Vibe Bar User', // You can make this configurable later
            }
          })
          
          if (saveResponse.success) {
            setSaveStatus(`Recipe saved successfully! ID: ${saveResponse.data?.recipe_id}`)
            console.log('Recipe saved to database:', saveResponse.data)
          }
        } catch (saveError) {
          console.warn('Failed to save recipe, but continuing:', saveError)
          setSaveStatus('Recipe generated but not saved to database')
        } finally {
          setIsSaving(false)
        }
        
        // Navigate to recipe view
        setCurrentView("recipe")
      } else {
        throw new Error(response.message || 'Failed to generate recipe')
      }
    } catch (error) {
      console.error('Recipe generation error:', error)
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const isLoading = isGenerating || isSaving

  return (
    <div className="space-y-4">
      {/* Recipe Generation Error */}
      {getError('recipeGeneration') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getError('recipeGeneration')}</AlertDescription>
        </Alert>
      )}

      {/* API Error */}
      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {/* Save Status */}
      {saveStatus && (
        <Alert variant={saveStatus.includes('successfully') ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveStatus}</AlertDescription>
        </Alert>
      )}

      {/* Generate Button */}
      <div className="text-center pt-4">
        <Button
          size="lg"
          className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerateRecipe}
          disabled={isLoading}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Recipe...
            </>
          ) : isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving Recipe...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Create Recipe
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 