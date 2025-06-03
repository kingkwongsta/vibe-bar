"use client"

import { useState } from "react"
import type { ViewType, CocktailFormData } from "@/lib/types"

export function useVibeBar() {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) 
        ? prev.filter((i) => i !== ingredient) 
        : [...prev, ingredient]
    )
  }

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) => 
      prev.includes(flavor) 
        ? prev.filter((f) => f !== flavor) 
        : [...prev, flavor]
    )
  }

  const getFormData = (): CocktailFormData => ({
    selectedIngredients,
    selectedFlavors,
  })

  const resetForm = () => {
    setSelectedIngredients([])
    setSelectedFlavors([])
  }

  return {
    currentView,
    setCurrentView,
    selectedIngredients,
    selectedFlavors,
    toggleIngredient,
    toggleFlavor,
    getFormData,
    resetForm,
  }
} 