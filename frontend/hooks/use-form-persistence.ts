import { useState, useEffect, useCallback } from "react"

const FORM_STATE_KEY = "vibe-bar-form-state"
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

interface FormState {
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredients: string[]
  selectedAlcoholStrength: string | null
  selectedVibe: string | null
  specialRequests: string
  dietaryRestrictions: string[]
  timestamp: number
}

export function useFormPersistence() {
  const [isRestored, setIsRestored] = useState(false)

  const saveFormState = useCallback((formState: Partial<FormState>) => {
    try {
      const stateWithTimestamp = {
        ...formState,
        timestamp: Date.now()
      }
      localStorage.setItem(FORM_STATE_KEY, JSON.stringify(stateWithTimestamp))
    } catch (error) {
      console.error("Failed to save form state:", error)
    }
  }, [])

  const loadFormState = useCallback((): Partial<FormState> | null => {
    try {
      const stored = localStorage.getItem(FORM_STATE_KEY)
      if (!stored) return null

      const parsedState = JSON.parse(stored) as FormState
      
      // Check if state is expired
      if (Date.now() - parsedState.timestamp > SESSION_TIMEOUT) {
        localStorage.removeItem(FORM_STATE_KEY)
        return null
      }

      setIsRestored(true)
      return parsedState
    } catch (error) {
      console.error("Failed to load form state:", error)
      return null
    }
  }, [])

  const clearFormState = useCallback(() => {
    try {
      localStorage.removeItem(FORM_STATE_KEY)
    } catch (error) {
      console.error("Failed to clear form state:", error)
    }
  }, [])

  return {
    saveFormState,
    loadFormState,
    clearFormState,
    isRestored
  }
} 