"use client"

import React, { createContext, useContext, useMemo, type ReactNode } from "react"
import { useVibeBar } from "@/hooks/use-vibe-bar"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import type { ViewType, UserPreferences } from "@/lib/types"
import type { CocktailRecipe } from "@/lib/api"

// Split contexts for better performance
interface ViewContextType {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

interface FormStateContextType {
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredientInput: string
  selectedVibe: string | null
  specialRequests: string
  isFormRestored: boolean
}

interface FormActionsContextType {
  toggleIngredient: (ingredient: string) => void
  toggleFlavor: (flavor: string) => void
  setCustomIngredientInput: (input: string) => void
  setVibe: (vibe: string) => void
  updateSpecialRequests: (requests: string) => void
  resetForm: () => void
}

interface RecipeContextType {
  generatedRecipe: CocktailRecipe | null
  setGeneratedRecipe: (recipe: CocktailRecipe) => void
}

interface UserPreferencesContextType {
  userPreferences: UserPreferences
}

interface UtilityContextType {
  prepareLLMPrompt: () => Record<string, unknown>
}

// Create separate contexts
const ViewContext = createContext<ViewContextType | undefined>(undefined)
const FormStateContext = createContext<FormStateContextType | undefined>(undefined)
const FormActionsContext = createContext<FormActionsContextType | undefined>(undefined)
const RecipeContext = createContext<RecipeContextType | undefined>(undefined)
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)
const UtilityContext = createContext<UtilityContextType | undefined>(undefined)

// Provider component
interface OptimizedVibeBarProviderProps {
  children: ReactNode
}

export function OptimizedVibeBarProvider({ children }: OptimizedVibeBarProviderProps) {
  const vibeBarHook = useVibeBar()
  const { preferences } = useUserPreferences()

  // Memoize context values to prevent unnecessary re-renders
  const viewContextValue = useMemo<ViewContextType>(() => ({
    currentView: vibeBarHook.currentView,
    setCurrentView: vibeBarHook.setCurrentView,
  }), [vibeBarHook.currentView, vibeBarHook.setCurrentView])

  const formStateContextValue = useMemo<FormStateContextType>(() => ({
    selectedIngredients: vibeBarHook.selectedIngredients,
    selectedFlavors: vibeBarHook.selectedFlavors,
    customIngredientInput: vibeBarHook.customIngredientInput,
    selectedVibe: vibeBarHook.selectedVibe,
    specialRequests: vibeBarHook.specialRequests,
    isFormRestored: vibeBarHook.isFormRestored,
  }), [
    vibeBarHook.selectedIngredients,
    vibeBarHook.selectedFlavors,
    vibeBarHook.customIngredientInput,
    vibeBarHook.selectedVibe,
    vibeBarHook.specialRequests,
    vibeBarHook.isFormRestored,
  ])

  const formActionsContextValue = useMemo<FormActionsContextType>(() => ({
    toggleIngredient: vibeBarHook.toggleIngredient,
    toggleFlavor: vibeBarHook.toggleFlavor,
    setCustomIngredientInput: vibeBarHook.setCustomIngredientInput,
    setVibe: vibeBarHook.setVibe,
    updateSpecialRequests: vibeBarHook.updateSpecialRequests,
    resetForm: vibeBarHook.resetForm,
  }), [
    vibeBarHook.toggleIngredient,
    vibeBarHook.toggleFlavor,
    vibeBarHook.setCustomIngredientInput,
    vibeBarHook.setVibe,
    vibeBarHook.updateSpecialRequests,
    vibeBarHook.resetForm,
  ])

  const recipeContextValue = useMemo<RecipeContextType>(() => ({
    generatedRecipe: vibeBarHook.generatedRecipe,
    setGeneratedRecipe: vibeBarHook.setGeneratedRecipe,
  }), [vibeBarHook.generatedRecipe, vibeBarHook.setGeneratedRecipe])

  const userPreferencesContextValue = useMemo<UserPreferencesContextType>(() => ({
    userPreferences: preferences,
  }), [preferences])

  const utilityContextValue = useMemo<UtilityContextType>(() => ({
    prepareLLMPrompt: () => {
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
  }), [
    vibeBarHook.selectedIngredients,
    vibeBarHook.selectedFlavors,
    vibeBarHook.selectedVibe,
    vibeBarHook.customIngredientInput,
    vibeBarHook.specialRequests,
    preferences
  ])

  return (
    <ViewContext.Provider value={viewContextValue}>
      <FormStateContext.Provider value={formStateContextValue}>
        <FormActionsContext.Provider value={formActionsContextValue}>
          <RecipeContext.Provider value={recipeContextValue}>
            <UserPreferencesContext.Provider value={userPreferencesContextValue}>
              <UtilityContext.Provider value={utilityContextValue}>
                {children}
              </UtilityContext.Provider>
            </UserPreferencesContext.Provider>
          </RecipeContext.Provider>
        </FormActionsContext.Provider>
      </FormStateContext.Provider>
    </ViewContext.Provider>
  )
}

// Custom hooks for each context
export function useViewContext() {
  const context = useContext(ViewContext)
  if (context === undefined) {
    throw new Error('useViewContext must be used within an OptimizedVibeBarProvider')
  }
  return context
}

export function useFormStateContext() {
  const context = useContext(FormStateContext)
  if (context === undefined) {
    throw new Error('useFormStateContext must be used within an OptimizedVibeBarProvider')
  }
  return context
}

export function useFormActionsContext() {
  const context = useContext(FormActionsContext)
  if (context === undefined) {
    throw new Error('useFormActionsContext must be used within an OptimizedVibeBarProvider')
  }
  return context
}

export function useRecipeContext() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within an OptimizedVibeBarProvider')
  }
  return context
}

export function useUserPreferencesContext() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferencesContext must be used within an OptimizedVibeBarProvider')
  }
  return context
}

export function useUtilityContext() {
  const context = useContext(UtilityContext)
  if (context === undefined) {
    throw new Error('useUtilityContext must be used within an OptimizedVibeBarProvider')
  }
  return context
}

// Convenience hook that combines commonly used contexts
export function useOptimizedVibeBarContext() {
  return {
    ...useViewContext(),
    ...useFormStateContext(),
    ...useFormActionsContext(),
    ...useRecipeContext(),
    ...useUserPreferencesContext(),
    ...useUtilityContext(),
  }
} 