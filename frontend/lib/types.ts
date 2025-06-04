export interface Recipe {
  id: number
  name: string
  rating: number
  ingredients: string[]
  time: string
  description?: string
}

export interface CocktailFormData {
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredients?: string
  occasion?: string
  specialRequests?: string
}

export type ViewType = "landing" | "recipe" | "saved" | "mybar" | "profile"

export interface BarInventory {
  spirits: string[]
  mixers: string[]
  garnishes: string[]
  tools: string[]
}

export interface UserPreferences {
  baseSpirits: string[]
  flavorProfiles: string[]
  dietaryRestrictions: string[]
  defaultVibe: string
  preferredVibes: string[]
}

export interface Vibe {
  id: string
  name: string
  description?: string
  mood: string
  icon?: string
}