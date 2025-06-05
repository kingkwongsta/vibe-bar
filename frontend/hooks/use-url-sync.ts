"use client"

import { useEffect, useRef } from 'react'
import { useUrlState } from '@/lib/url-state'
import { useVibeBarStore, useUrlSync, loadFromStorage } from '@/store/vibe-bar-store'

/**
 * Hook that synchronizes Zustand store with URL state
 * Enables deep linking and shareable URLs
 */
export function useUrlStateSync() {
  const { getCurrentUrlState, updateUrlState } = useUrlState()
  const { syncFromUrl, getUrlSyncState } = useUrlSync()
  const initialized = useRef(false)
  const isUpdatingUrl = useRef(false)

  // Initialize from URL on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const urlState = getCurrentUrlState()
    
    // Check if URL has any state to restore
    const hasUrlState = Boolean(
      urlState.view !== 'landing' ||
      urlState.ingredients?.length ||
      urlState.flavors?.length ||
      urlState.vibe ||
      urlState.requests?.trim() ||
      urlState.recipeId
    )

    if (hasUrlState) {
      // URL has state - restore from URL
      console.log('Restoring from URL:', urlState)
      syncFromUrl(urlState)
    } else {
      // No URL state - try to restore from localStorage
      const savedState = loadFromStorage()
      if (savedState) {
        console.log('Restoring from localStorage:', savedState)
        useVibeBarStore.setState(savedState)
      }
    }
  }, [])

  // Subscribe to store changes and update URL
  useEffect(() => {
    const unsubscribe = useVibeBarStore.subscribe(
      (state) => getUrlSyncState(),
      (newState) => {
        // Prevent infinite loops
        if (isUpdatingUrl.current) return
        
        // Only update URL if we have meaningful state
        const hasState = Boolean(
          newState.view !== 'landing' ||
          newState.ingredients?.length ||
          newState.flavors?.length ||
          newState.vibe ||
          newState.requests?.trim()
        )

        if (hasState) {
          isUpdatingUrl.current = true
          updateUrlState(newState, { replace: true })
          setTimeout(() => {
            isUpdatingUrl.current = false
          }, 100)
        }
      },
      {
        // Only trigger when relevant fields change
        equalityFn: (a, b) => {
          return (
            a.view === b.view &&
            JSON.stringify(a.ingredients) === JSON.stringify(b.ingredients) &&
            JSON.stringify(a.flavors) === JSON.stringify(b.flavors) &&
            a.vibe === b.vibe &&
            a.requests === b.requests
          )
        },
      }
    )

    return unsubscribe
  }, [updateUrlState, getUrlSyncState])

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const urlState = getCurrentUrlState()
      console.log('Browser navigation detected, syncing:', urlState)
      syncFromUrl(urlState)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [getCurrentUrlState, syncFromUrl])
}

/**
 * Hook for sharing current state via URL
 */
export function useShareableUrl() {
  const { generateShareableUrl } = useUrlState()
  const { getUrlSyncState } = useUrlSync()

  const getShareableUrl = () => {
    const state = getUrlSyncState()
    return generateShareableUrl(state)
  }

  const copyToClipboard = async () => {
    try {
      const url = getShareableUrl()
      await navigator.clipboard.writeText(url)
      return { success: true, url }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return { success: false, error }
    }
  }

  return {
    getShareableUrl,
    copyToClipboard,
  }
}

/**
 * Hook for recipe sharing
 */
export function useRecipeShare() {
  const { updateUrlState, generateShareableUrl } = useUrlState()
  const currentView = useVibeBarStore((state) => state.currentView)
  const generatedRecipe = useVibeBarStore((state) => state.generatedRecipe)

  const shareRecipe = (recipeId?: string) => {
    // Use provided recipeId or generate one from recipe title
    const recipeIdToUse = recipeId || (generatedRecipe ? 
      encodeURIComponent(generatedRecipe.recipeTitle.toLowerCase().replace(/\s+/g, '-')) : 
      null)
    
    if (!recipeIdToUse) {
      console.warn('No recipe ID available for sharing')
      return null
    }

    // Update URL to recipe view with recipe ID
    updateUrlState({
      view: 'recipe',
      recipeId: recipeIdToUse,
    })

    // Generate shareable URL
    const shareableUrl = generateShareableUrl({
      view: 'recipe',
      recipeId: recipeIdToUse,
    })

    return shareableUrl
  }

  const copyRecipeUrl = async (recipeId?: string) => {
    try {
      const url = shareRecipe(recipeId)
      if (!url) return { success: false, error: 'No recipe to share' }
      
      await navigator.clipboard.writeText(url)
      return { success: true, url }
    } catch (error) {
      console.error('Failed to copy recipe URL:', error)
      return { success: false, error }
    }
  }

  return {
    shareRecipe,
    copyRecipeUrl,
  }
}

/**
 * Hook for form state bookmarking
 */
export function useFormBookmark() {
  const { generateShareableUrl } = useUrlState()
  const formState = useVibeBarStore((state) => ({
    ingredients: state.selectedIngredients,
    flavors: state.selectedFlavors,
    vibe: state.selectedVibe,
    requests: state.specialRequests,
  }))

  const createBookmark = (name?: string) => {
    const url = generateShareableUrl({
      view: 'landing',
      ...formState,
    })

    return {
      name: name || `Form state ${new Date().toLocaleDateString()}`,
      url,
      state: formState,
      timestamp: Date.now(),
    }
  }

  const getBookmarkableState = () => {
    const hasState = Boolean(
      formState.ingredients.length ||
      formState.flavors.length ||
      formState.vibe ||
      formState.requests?.trim()
    )

    return hasState ? formState : null
  }

  return {
    createBookmark,
    getBookmarkableState,
    formState,
  }
} 