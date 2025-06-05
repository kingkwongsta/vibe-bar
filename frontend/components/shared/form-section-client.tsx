"use client"

import { Card, CardContent } from "@/components/ui/card"
import { IngredientSelectorZustand } from "@/components/shared/ingredient-selector-zustand"
import { FlavorSelector } from "@/components/shared/flavor-selector"
import { VibeSelector } from "@/components/shared/vibe-selector"
import { SpecialRequestsInput } from "@/components/shared/special-requests-input"
import { RecipeGenerationButton } from "@/components/shared/recipe-generation-button"

export default function FormSectionClient() {
  return (
    <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="space-y-8 mt-4">
        <IngredientSelectorZustand />
        <FlavorSelector />
        <VibeSelector />
        <SpecialRequestsInput />
        <RecipeGenerationButton />
      </CardContent>
    </Card>
  )
} 