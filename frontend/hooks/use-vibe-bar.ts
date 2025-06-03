"use client"

import { useState } from "react"
import type { ViewType, CocktailFormData } from "@/lib/types"

export function useVibeBar() {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [customIngredients, setCustomIngredients] = useState<string[]>([])
  const [customIngredientInput, setCustomIngredientInput] = useState("")
  const [selectedAlcoholStrength, setSelectedAlcoholStrength] = useState<string | null>(null)
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)

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

  const addCustomIngredient = () => {
    const ingredient = customIngredientInput.trim()
    if (ingredient && !customIngredients.includes(ingredient) && !selectedIngredients.includes(ingredient)) {
      setCustomIngredients((prev) => [...prev, ingredient])
      setCustomIngredientInput("")
    }
  }

  const removeCustomIngredient = (ingredient: string) => {
    setCustomIngredients((prev) => prev.filter((i) => i !== ingredient))
  }

  const setAlcoholStrength = (strength: string) => {
    setSelectedAlcoholStrength(strength)
  }

  const setVibe = (vibe: string) => {
    setSelectedVibe(vibe)
  }

  const getFormData = (): CocktailFormData => ({
    selectedIngredients: [...selectedIngredients, ...customIngredients],
    selectedFlavors,
    customIngredients,
  })

  const resetForm = () => {
    setSelectedIngredients([])
    setSelectedFlavors([])
    setCustomIngredients([])
    setCustomIngredientInput("")
    setSelectedAlcoholStrength(null)
    setSelectedVibe(null)
  }

  return {
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
    getFormData,
    resetForm,
  }
} 