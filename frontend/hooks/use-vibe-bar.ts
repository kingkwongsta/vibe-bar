"use client"

import { useState } from "react"
import type { ViewType, CocktailFormData } from "@/lib/types"
import { logger } from "@/lib/logger"

export function useVibeBar() {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [customIngredients, setCustomIngredients] = useState<string[]>([])
  const [customIngredientInput, setCustomIngredientInput] = useState("")
  const [selectedAlcoholStrength, setSelectedAlcoholStrength] = useState<string | null>(null)
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)

  // Enhanced view setter with logging
  const setCurrentViewWithLogging = (view: ViewType) => {
    const previousView = currentView
    setCurrentView(view)
    
    // Log navigation
    logger.logUserAction('navigation', {
      from: previousView,
      to: view,
      timestamp: Date.now()
    })
  }

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      const isRemoving = prev.includes(ingredient)
      const newIngredients = isRemoving 
        ? prev.filter((i) => i !== ingredient) 
        : [...prev, ingredient]
      
      // Log the preference selection
      logger.logPreferenceSelection(
        'ingredient', 
        ingredient, 
        isRemoving ? 'deselect' : 'select'
      )
      
      return newIngredients
    })
  }

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) => {
      const isRemoving = prev.includes(flavor)
      const newFlavors = isRemoving 
        ? prev.filter((f) => f !== flavor) 
        : [...prev, flavor]
      
      // Log the preference selection
      logger.logPreferenceSelection(
        'flavor', 
        flavor, 
        isRemoving ? 'deselect' : 'select'
      )
      
      return newFlavors
    })
  }

  const addCustomIngredient = () => {
    const ingredient = customIngredientInput.trim()
    if (ingredient && !customIngredients.includes(ingredient) && !selectedIngredients.includes(ingredient)) {
      setCustomIngredients((prev) => [...prev, ingredient])
      setCustomIngredientInput("")
      
      // Log custom ingredient addition
      logger.logPreferenceSelection('custom-ingredient', ingredient, 'select')
    }
  }

  const removeCustomIngredient = (ingredient: string) => {
    setCustomIngredients((prev) => prev.filter((i) => i !== ingredient))
    
    // Log custom ingredient removal
    logger.logPreferenceSelection('custom-ingredient', ingredient, 'deselect')
  }

  const setAlcoholStrength = (strength: string) => {
    const previousStrength = selectedAlcoholStrength
    setSelectedAlcoholStrength(strength)
    
    // Log alcohol strength selection
    logger.logPreferenceSelection('alcohol-strength', {
      new: strength,
      previous: previousStrength
    }, 'change')
  }

  const setVibe = (vibe: string) => {
    const previousVibe = selectedVibe
    setSelectedVibe(vibe)
    
    // Log vibe selection
    logger.logPreferenceSelection('vibe', {
      new: vibe,
      previous: previousVibe
    }, 'change')
  }

  const getFormData = (): CocktailFormData => {
    const formData = {
      selectedIngredients: [...selectedIngredients, ...customIngredients],
      selectedFlavors,
      customIngredients,
    }
    
    // Log form data collection
    logger.logUserAction('form-data-collected', {
      totalIngredients: formData.selectedIngredients.length,
      totalFlavors: formData.selectedFlavors.length,
      customIngredients: formData.customIngredients.length,
      alcoholStrength: selectedAlcoholStrength,
      vibe: selectedVibe
    })
    
    return formData
  }

  const resetForm = () => {
    // Log form reset with previous state
    logger.logUserAction('form-reset', {
      previousState: {
        ingredients: selectedIngredients.length,
        flavors: selectedFlavors.length,
        customIngredients: customIngredients.length,
        alcoholStrength: selectedAlcoholStrength,
        vibe: selectedVibe
      }
    })
    
    setSelectedIngredients([])
    setSelectedFlavors([])
    setCustomIngredients([])
    setCustomIngredientInput("")
    setSelectedAlcoholStrength(null)
    setSelectedVibe(null)
  }

  return {
    currentView,
    setCurrentView: setCurrentViewWithLogging,
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