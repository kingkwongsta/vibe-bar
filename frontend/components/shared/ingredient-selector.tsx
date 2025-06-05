"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { INGREDIENTS } from "@/lib/constants"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"
import { useFormValidation } from "@/hooks/use-form-validation"

export function IngredientSelector() {
  const {
    selectedIngredients,
    customIngredientInput,
    toggleIngredient,
    setCustomIngredientInput,
  } = useVibeBarContext()

  const {
    validateSpecialRequestsInput,
    validateSelectionLimitsInput,
    getError,
    clearError,
  } = useFormValidation()

  const handleIngredientToggle = (ingredient: string) => {
    // Clear selection limit errors when toggling
    clearError('selectionLimits')
    
    const newSelectedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter(i => i !== ingredient)
      : [...selectedIngredients, ingredient]
    
    // Validate after toggle
    validateSelectionLimitsInput(newSelectedIngredients, []) // Empty flavors for now
    toggleIngredient(ingredient)
  }

  const handleCustomIngredientsChange = (ingredients: string) => {
    clearError('customIngredient')
    const validation = validateSpecialRequestsInput(ingredients)
    if (!validation.isValid && validation.error) {
      // Validation errors will be shown by the validation hook
    }
    setCustomIngredientInput(ingredients)
  }

  return (
    <div className="space-y-8">
      {/* Available Ingredients */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Choose a spirit or non-alcoholic option
        </Label>
        <div className="flex flex-wrap gap-4">
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
    </div>
  )
} 