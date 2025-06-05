"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { FLAVOR_PROFILES } from "@/lib/constants"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"
import { useFormValidation } from "@/hooks/use-form-validation"

export function FlavorSelector() {
  const {
    selectedFlavors,
    selectedIngredients,
    toggleFlavor,
  } = useVibeBarContext()

  const {
    validateSelectionLimitsInput,
    clearError,
  } = useFormValidation()

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

  return (
    <div>
      <Label className="text-lg font-semibold mb-4 block">
        Choose a flavor profile?
      </Label>
      <div className="flex flex-wrap gap-4">
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
  )
} 