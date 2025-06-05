"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useVibeBar } from "@/hooks/use-vibe-bar"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import type { ViewType, UserPreferences } from "@/lib/types"
import type { CocktailRecipe } from "@/lib/api"

// Define the context interface
interface VibeBarContextType {
  // View state
  currentView: ViewType
  setCurrentView: (view: ViewType) => void

  // Form state
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredientInput: string
  selectedVibe: string | null
  specialRequests: string

  // Form actions
  toggleIngredient: (ingredient: string) => void
  toggleFlavor: (flavor: string) => void
  setCustomIngredientInput: (input: string) => void
  setVibe: (vibe: string) => void
  updateSpecialRequests: (requests: string) => void

  // Recipe state
  generatedRecipe: CocktailRecipe | null
  setGeneratedRecipe: (recipe: CocktailRecipe) => void

  // Utility actions
  resetForm: () => void
  isFormRestored: boolean

  // User preferences
  userPreferences: UserPreferences

  // Helper function for LLM prompt
  prepareLLMPrompt: () => Record<string, unknown>
}

// Create the context
const VibeBarContext = createContext<VibeBarContextType | undefined>(undefined)

// Provider component
interface VibeBarProviderProps {
  children: ReactNode
}

export function VibeBarProvider({ children }: VibeBarProviderProps) {
  const vibeBarHook = useVibeBar()
  const { preferences } = useUserPreferences()

  // Function to prepare LLM prompt data
  const prepareLLMPrompt = () => {
    const prompt = {
      ingredients: vibeBarHook.selectedIngredients.length > 0 
        ? vibeBarHook.selectedIngredients 
        : preferences.baseSpirits,
      flavors: vibeBarHook.selectedFlavors.length > 0 
        ? vibeBarHook.selectedFlavors 
        : preferences.flavorProfiles,
      vibe: vibeBarHook.selectedVibe || preferences.defaultVibe,
      dietaryRestrictions: preferences.dietaryRestrictions,
      customIngredients: vibeBarHook.customIngredientInput.trim() || undefined,
      specialRequests: vibeBarHook.specialRequests.trim() || undefined,
      userContext: {
        preferredSpirits: preferences.baseSpirits,
        preferredFlavors: preferences.flavorProfiles,
        preferredVibes: preferences.preferredVibes,
        restrictions: preferences.dietaryRestrictions
      }
    }
    
    console.log("LLM Prompt Data:", prompt)
    return prompt
  }

  // Combine all the values for the context
  const contextValue: VibeBarContextType = {
    // View state
    currentView: vibeBarHook.currentView,
    setCurrentView: vibeBarHook.setCurrentView,

    // Form state
    selectedIngredients: vibeBarHook.selectedIngredients,
    selectedFlavors: vibeBarHook.selectedFlavors,
    customIngredientInput: vibeBarHook.customIngredientInput,
    selectedVibe: vibeBarHook.selectedVibe,
    specialRequests: vibeBarHook.specialRequests,

    // Form actions
    toggleIngredient: vibeBarHook.toggleIngredient,
    toggleFlavor: vibeBarHook.toggleFlavor,
    setCustomIngredientInput: vibeBarHook.setCustomIngredientInput,
    setVibe: vibeBarHook.setVibe,
    updateSpecialRequests: vibeBarHook.updateSpecialRequests,

    // Recipe state
    generatedRecipe: vibeBarHook.generatedRecipe,
    setGeneratedRecipe: vibeBarHook.setGeneratedRecipe,

    // Utility actions
    resetForm: vibeBarHook.resetForm,
    isFormRestored: vibeBarHook.isFormRestored,

    // User preferences
    userPreferences: preferences,

    // Helper function
    prepareLLMPrompt,
  }

  return (
    <VibeBarContext.Provider value={contextValue}>
      {children}
    </VibeBarContext.Provider>
  )
}

// Custom hook to use the context
export function useVibeBarContext() {
  const context = useContext(VibeBarContext)
  if (context === undefined) {
    throw new Error('useVibeBarContext must be used within a VibeBarProvider')
  }
  return context
}

// Export types for consumers
export type { VibeBarContextType } 