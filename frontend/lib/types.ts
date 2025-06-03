export interface Recipe {
  id: number
  name: string
  rating: number
  ingredients: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  time: string
  description?: string
}

export interface CocktailFormData {
  selectedIngredients: string[]
  selectedFlavors: string[]
  strength?: string
  occasion?: string
  difficulty?: string
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
  defaultStrength: string
  preferredDifficulty: string
  dietaryRestrictions: string[]
} 