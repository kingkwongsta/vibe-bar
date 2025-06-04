"use client"

import { useState, useEffect } from "react"
import type { UserPreferences } from "@/lib/types"

const PREFERENCES_STORAGE_KEY = "vibe-bar-user-preferences"

const defaultPreferences: UserPreferences = {
  baseSpirits: [],
  flavorProfiles: [],
  dietaryRestrictions: [],
  defaultVibe: "",
  preferredVibes: []
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY)
      if (stored) {
        const parsedPreferences = JSON.parse(stored)
        setPreferences({ ...defaultPreferences, ...parsedPreferences })
      }
    } catch (error) {
      console.error("Error loading user preferences:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences }
      setPreferences(updatedPreferences)
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updatedPreferences))
      return true
    } catch (error) {
      console.error("Error saving user preferences:", error)
      return false
    }
  }

  // Toggle a base spirit
  const toggleBaseSpirit = (spirit: string) => {
    const updatedSpirits = preferences.baseSpirits.includes(spirit)
      ? preferences.baseSpirits.filter(s => s !== spirit)
      : [...preferences.baseSpirits, spirit]
    
    savePreferences({ baseSpirits: updatedSpirits })
  }

  // Toggle a flavor profile
  const toggleFlavorProfile = (flavor: string) => {
    const updatedFlavors = preferences.flavorProfiles.includes(flavor)
      ? preferences.flavorProfiles.filter(f => f !== flavor)
      : [...preferences.flavorProfiles, flavor]
    
    savePreferences({ flavorProfiles: updatedFlavors })
  }

  // Toggle dietary restriction
  const toggleDietaryRestriction = (restriction: string) => {
    const updatedRestrictions = preferences.dietaryRestrictions.includes(restriction)
      ? preferences.dietaryRestrictions.filter(r => r !== restriction)
      : [...preferences.dietaryRestrictions, restriction]
    
    savePreferences({ dietaryRestrictions: updatedRestrictions })
  }

  // Set default vibe
  const setDefaultVibe = (vibe: string) => {
    savePreferences({ defaultVibe: vibe })
  }

  // Toggle preferred vibe
  const togglePreferredVibe = (vibe: string) => {
    const updatedVibes = preferences.preferredVibes.includes(vibe)
      ? preferences.preferredVibes.filter(v => v !== vibe)
      : [...preferences.preferredVibes, vibe]
    
    savePreferences({ preferredVibes: updatedVibes })
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem(PREFERENCES_STORAGE_KEY)
  }

  // Complete save (for save button)
  const saveAllPreferences = () => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
      return true
    } catch (error) {
      console.error("Error saving preferences:", error)
      return false
    }
  }

  return {
    preferences,
    isLoading,
    toggleBaseSpirit,
    toggleFlavorProfile,
    toggleDietaryRestriction,
    setDefaultVibe,
    togglePreferredVibe,
    savePreferences,
    saveAllPreferences,
    resetToDefaults
  }
} 