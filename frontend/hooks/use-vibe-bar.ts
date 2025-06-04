"use client"

import { useState, useEffect, useCallback } from "react"
import type { ViewType, CocktailFormData } from "@/lib/types"
import { logger } from "@/lib/logger"
import { useFormPersistence } from "./use-form-persistence"

// Debounce utility
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>()

  return useCallback(
    ((...args) => {
      if (debounceTimer) clearTimeout(debounceTimer)
      setDebounceTimer(setTimeout(() => callback(...args), delay))
    }) as T,
    [callback, delay, debounceTimer]
  )
}

export function useVibeBar() {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [customIngredients, setCustomIngredients] = useState<string[]>([])
  const [customIngredientInput, setCustomIngredientInput] = useState("")
  const [selectedAlcoholStrength, setSelectedAlcoholStrength] = useState<string | null>(null)
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [specialRequests, setSpecialRequests] = useState("")

  const { saveFormState, loadFormState, clearFormState, isRestored } = useFormPersistence()

  // Debounced save function
  const debouncedSave = useDebounce(() => {
    saveFormState({
      selectedIngredients,
      selectedFlavors,
      customIngredients,
      selectedAlcoholStrength,
      selectedVibe,
      dietaryRestrictions,
      specialRequests,
    })
  }, 1000) // Save after 1 second of inactivity

  // Auto-save effect
  useEffect(() => {
    if (isRestored) {
      debouncedSave()
    }
  }, [
    selectedIngredients,
    selectedFlavors,
    customIngredients,
    selectedAlcoholStrength,
    selectedVibe,
    dietaryRestrictions,
    specialRequests,
    debouncedSave,
    isRestored,
  ])

  // Restore state on mount
  useEffect(() => {
    const savedState = loadFormState()
    if (savedState) {
      if (savedState.selectedIngredients) setSelectedIngredients(savedState.selectedIngredients)
      if (savedState.selectedFlavors) setSelectedFlavors(savedState.selectedFlavors)
      if (savedState.customIngredients) setCustomIngredients(savedState.customIngredients)
      if (savedState.selectedAlcoholStrength) setSelectedAlcoholStrength(savedState.selectedAlcoholStrength)
      if (savedState.selectedVibe) setSelectedVibe(savedState.selectedVibe)
      if (savedState.dietaryRestrictions) setDietaryRestrictions(savedState.dietaryRestrictions)
      if (savedState.specialRequests) setSpecialRequests(savedState.specialRequests)
      
      logger.logUserAction('form-state-restored', {
        restoredFields: Object.keys(savedState).filter(key => key !== 'timestamp'),
        timestamp: savedState.timestamp
      })
    }
  }, [loadFormState])

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

  const updateSpecialRequests = (requests: string) => {
    setSpecialRequests(requests)
    
    // Log special requests update
    logger.logPreferenceSelection('special-requests', {
      requests: requests.substring(0, 50) + (requests.length > 50 ? '...' : ''), // Log first 50 chars for privacy
      length: requests.length
    }, 'change')
  }

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions((prev) => {
      const isRemoving = prev.includes(restriction)
      const newRestrictions = isRemoving 
        ? prev.filter((r) => r !== restriction) 
        : [...prev, restriction]
      
      // Log dietary restriction toggle
      logger.logPreferenceSelection(
        'dietary-restriction', 
        restriction, 
        isRemoving ? 'deselect' : 'select'
      )
      
      return newRestrictions
    })
  }

  const getFormData = (): CocktailFormData => {
    const formData = {
      selectedIngredients: [...selectedIngredients, ...customIngredients],
      selectedFlavors,
      customIngredients,
      strength: selectedAlcoholStrength || undefined,
      occasion: selectedVibe || undefined,
      specialRequests: specialRequests.trim() || undefined,
    }
    
    // Log form data collection
    logger.logUserAction('form-data-collected', {
      totalIngredients: formData.selectedIngredients.length,
      totalFlavors: formData.selectedFlavors.length,
      customIngredients: formData.customIngredients.length,
      alcoholStrength: selectedAlcoholStrength,
      vibe: selectedVibe,
      hasSpecialRequests: !!formData.specialRequests,
      dietaryRestrictions: dietaryRestrictions.length
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
        vibe: selectedVibe,
        specialRequests: specialRequests.length,
        dietaryRestrictions: dietaryRestrictions.length
      }
    })
    
    setSelectedIngredients([])
    setSelectedFlavors([])
    setCustomIngredients([])
    setCustomIngredientInput("")
    setSelectedAlcoholStrength(null)
    setSelectedVibe(null)
    setSpecialRequests("")
    setDietaryRestrictions([])
    
    // Clear persisted state
    clearFormState()
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
    dietaryRestrictions,
    specialRequests,
    toggleIngredient,
    toggleFlavor,
    addCustomIngredient,
    removeCustomIngredient,
    setCustomIngredientInput,
    setAlcoholStrength,
    setVibe,
    toggleDietaryRestriction,
    updateSpecialRequests,
    getFormData,
    resetForm,
    // Expose restoration state for UI feedback
    isFormRestored: isRestored,
  }
} 