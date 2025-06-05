import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { ViewType, UserPreferences } from '@/lib/types'
import type { CocktailRecipe } from '@/lib/api'
import type { UrlState } from '@/lib/url-state'

// Main application state interface
interface VibeBarState {
  // View management
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  
  // Form state
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredientInput: string
  selectedVibe: string | null
  specialRequests: string
  isFormRestored: boolean
  
  // Form actions
  toggleIngredient: (ingredient: string) => void
  toggleFlavor: (flavor: string) => void
  setCustomIngredientInput: (input: string) => void
  setVibe: (vibe: string) => void
  updateSpecialRequests: (requests: string) => void
  resetForm: () => void
  
  // Recipe management
  generatedRecipe: CocktailRecipe | null
  setGeneratedRecipe: (recipe: CocktailRecipe) => void
  
  // URL state synchronization
  syncFromUrl: (urlState: UrlState) => void
  getUrlSyncState: () => Partial<UrlState>
  
  // Form restoration
  setFormRestored: (restored: boolean) => void
  
  // Bulk state update for URL restoration
  updateFormState: (state: {
    ingredients?: string[]
    flavors?: string[]
    vibe?: string | null
    requests?: string
  }) => void
}

// Default form state
const defaultFormState = {
  selectedIngredients: [],
  selectedFlavors: [],
  customIngredientInput: '',
  selectedVibe: null,
  specialRequests: '',
}

// Create the main store
export const useVibeBarStore = create<VibeBarState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // View state
      currentView: 'landing',
      setCurrentView: (view) => set({ currentView: view }, false, 'setCurrentView'),
      
      // Form state
      ...defaultFormState,
      isFormRestored: false,
      
      // Form actions
      toggleIngredient: (ingredient) => set((state) => {
        const isSelected = state.selectedIngredients.includes(ingredient)
        const newIngredients = isSelected
          ? state.selectedIngredients.filter(i => i !== ingredient)
          : [...state.selectedIngredients, ingredient]
        
        return { selectedIngredients: newIngredients }
      }, false, 'toggleIngredient'),
      
      toggleFlavor: (flavor) => set((state) => {
        const isSelected = state.selectedFlavors.includes(flavor)
        const newFlavors = isSelected
          ? state.selectedFlavors.filter(f => f !== flavor)
          : [...state.selectedFlavors, flavor]
        
        return { selectedFlavors: newFlavors }
      }, false, 'toggleFlavor'),
      
      setCustomIngredientInput: (input) => 
        set({ customIngredientInput: input }, false, 'setCustomIngredientInput'),
      
      setVibe: (vibe) => 
        set({ selectedVibe: vibe }, false, 'setVibe'),
      
      updateSpecialRequests: (requests) => 
        set({ specialRequests: requests }, false, 'updateSpecialRequests'),
      
      resetForm: () => set({ 
        ...defaultFormState,
        isFormRestored: false 
      }, false, 'resetForm'),
      
      // Recipe state
      generatedRecipe: null,
      setGeneratedRecipe: (recipe) => 
        set({ generatedRecipe: recipe }, false, 'setGeneratedRecipe'),
      
      // Form restoration
      setFormRestored: (restored) => 
        set({ isFormRestored: restored }, false, 'setFormRestored'),
      
      // Bulk state update for URL restoration
      updateFormState: (newState) => set((state) => ({
        selectedIngredients: newState.ingredients ?? state.selectedIngredients,
        selectedFlavors: newState.flavors ?? state.selectedFlavors,
        selectedVibe: newState.vibe ?? state.selectedVibe,
        specialRequests: newState.requests ?? state.specialRequests,
        isFormRestored: true,
      }), false, 'updateFormState'),
      
      // URL synchronization
      syncFromUrl: (urlState) => {
        const state = get()
        const updates: Partial<VibeBarState> = {}
        
        // Only update if values are different to prevent loops
        if (urlState.view && urlState.view !== state.currentView) {
          updates.currentView = urlState.view
        }
        
        if (urlState.ingredients && 
            JSON.stringify(urlState.ingredients) !== JSON.stringify(state.selectedIngredients)) {
          updates.selectedIngredients = urlState.ingredients
          updates.isFormRestored = true
        }
        
        if (urlState.flavors && 
            JSON.stringify(urlState.flavors) !== JSON.stringify(state.selectedFlavors)) {
          updates.selectedFlavors = urlState.flavors
          updates.isFormRestored = true
        }
        
        if (urlState.vibe !== undefined && urlState.vibe !== state.selectedVibe) {
          updates.selectedVibe = urlState.vibe
          updates.isFormRestored = true
        }
        
        if (urlState.requests && urlState.requests !== state.specialRequests) {
          updates.specialRequests = urlState.requests
          updates.isFormRestored = true
        }
        
        if (Object.keys(updates).length > 0) {
          set(updates, false, 'syncFromUrl')
        }
      },
      
      getUrlSyncState: () => {
        const state = get()
        return {
          view: state.currentView,
          ingredients: state.selectedIngredients,
          flavors: state.selectedFlavors,
          vibe: state.selectedVibe,
          requests: state.specialRequests,
        }
      },
    })),
    {
      name: 'vibe-bar-store',
    }
  )
)

// Selector hooks for optimized component subscriptions
export const useCurrentView = () => useVibeBarStore((state) => state.currentView)
export const useFormState = () => useVibeBarStore((state) => ({
  selectedIngredients: state.selectedIngredients,
  selectedFlavors: state.selectedFlavors,
  customIngredientInput: state.customIngredientInput,
  selectedVibe: state.selectedVibe,
  specialRequests: state.specialRequests,
  isFormRestored: state.isFormRestored,
}))

export const useFormActions = () => useVibeBarStore((state) => ({
  toggleIngredient: state.toggleIngredient,
  toggleFlavor: state.toggleFlavor,
  setCustomIngredientInput: state.setCustomIngredientInput,
  setVibe: state.setVibe,
  updateSpecialRequests: state.updateSpecialRequests,
  resetForm: state.resetForm,
  setFormRestored: state.setFormRestored,
  updateFormState: state.updateFormState,
}))

export const useRecipeState = () => useVibeBarStore((state) => ({
  generatedRecipe: state.generatedRecipe,
  setGeneratedRecipe: state.setGeneratedRecipe,
}))

export const useUrlSync = () => useVibeBarStore((state) => ({
  syncFromUrl: state.syncFromUrl,
  getUrlSyncState: state.getUrlSyncState,
}))

// Persistence configuration
const STORAGE_KEY = 'vibe-bar-state'

// Save to localStorage with debouncing
let saveTimeout: NodeJS.Timeout | null = null
export const saveToStorage = (state: Partial<VibeBarState>) => {
  if (typeof window === 'undefined') return
  
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    try {
      const dataToSave = {
        selectedIngredients: state.selectedIngredients,
        selectedFlavors: state.selectedFlavors,
        customIngredientInput: state.customIngredientInput,
        selectedVibe: state.selectedVibe,
        specialRequests: state.specialRequests,
        timestamp: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }, 500)
}

// Load from localStorage
export const loadFromStorage = (): Partial<VibeBarState> | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const parsed = JSON.parse(stored)
    
    // Check if data is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000
    if (Date.now() - parsed.timestamp > maxAge) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    
    return {
      selectedIngredients: parsed.selectedIngredients || [],
      selectedFlavors: parsed.selectedFlavors || [],
      customIngredientInput: parsed.customIngredientInput || '',
      selectedVibe: parsed.selectedVibe || null,
      specialRequests: parsed.specialRequests || '',
      isFormRestored: true,
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

// Subscribe to form state changes for persistence
if (typeof window !== 'undefined') {
  useVibeBarStore.subscribe(
    (state) => ({
      selectedIngredients: state.selectedIngredients,
      selectedFlavors: state.selectedFlavors,
      customIngredientInput: state.customIngredientInput,
      selectedVibe: state.selectedVibe,
      specialRequests: state.specialRequests,
    }),
    (formState) => {
      saveToStorage(formState)
    },
    {
      equalityFn: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
} 