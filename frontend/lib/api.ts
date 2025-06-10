/**
 * API utility functions for communicating with the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
  timestamp: string
}

export interface UserPreferences {
  ingredients: string[]
  customIngredients?: string
  flavors: string[]
  vibe?: string
  specialRequests?: string
  model?: string
}

export interface CocktailRecipe {
  recipeTitle: string
  recipeDescription: string
  recipeMeta: Array<{ text: string }>
  recipeIngredients: Array<{ name: string; amount: string }>
  recipeInstructions: string[]
  recipeDetails: Array<{ title: string; content: string }>
}

export interface SaveRecipeData {
  recipe: CocktailRecipe
  preferences: UserPreferences
  creator?: {
    name?: string
    email?: string
  }
}

export interface SavedRecipeResponse {
  recipe_id: string
  recipe_name: string
  creator: string
  created_at: string
  vibe?: string
  ai_model_used?: string
}

// Community recipe interfaces
export interface CommunityRecipe {
  id: string
  name: string
  description: string
  ingredients: Array<{ name: string; amount: string }>
  instructions: string[]
  meta: Array<{ text: string }>
  details: Array<{ title: string; content: string }>
  creator_name?: string
  creator_email?: string
  tags: string[]
  flavor_profile: string[]
  vibe?: string
  difficulty_level?: string
  prep_time_minutes?: number
  servings?: number
  rating_average?: number
  rating_count?: number
  view_count?: number
  favorite_count?: number
  ai_model_used?: string
  created_at: string
  updated_at: string
}

export interface CommunityRecipeListResponse {
  recipes: CommunityRecipe[]
  total_count: number
  page: number
  per_page: number
  total_pages: number
}

/**
 * Test backend connectivity
 */
export async function testBackendConnectivity(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Backend connectivity test failed:', error)
    throw new Error(`Failed to connect to backend: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate cocktail recipe from user preferences
 */
export async function generateCocktailRecipe(preferences: UserPreferences): Promise<ApiResponse<CocktailRecipe>> {
  try {
    console.log('Sending request to backend:', { preferences })
    
    const response = await fetch(`${API_BASE_URL}/api/cocktails/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`)
    }

    const result = await response.json()
    console.log('Backend response:', result)
    return result
  } catch (error) {
    console.error('Cocktail recipe generation failed:', error)
    throw new Error(`Failed to generate recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Save cocktail recipe to database
 */
export async function saveCocktailRecipe(data: SaveRecipeData): Promise<ApiResponse<SavedRecipeResponse>> {
  try {
    console.log('Saving recipe to backend:', { data })
    
    const response = await fetch(`${API_BASE_URL}/api/cocktails/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`)
    }

    const result = await response.json()
    console.log('Recipe saved successfully:', result)
    return result
  } catch (error) {
    console.error('Recipe saving failed:', error)
    throw new Error(`Failed to save recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Fetch community recipes from database
 */
export async function getCommunityRecipes(page: number = 1, per_page: number = 12): Promise<ApiResponse<CommunityRecipeListResponse>> {
  try {
    console.log('Fetching community recipes:', { page, per_page })
    
    const response = await fetch(`${API_BASE_URL}/api/community-vibes/recipes?page=${page}&per_page=${per_page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`)
    }

    const result = await response.json()
    console.log('Community recipes fetched:', result)
    return result
  } catch (error) {
    console.error('Community recipes fetch failed:', error)
    throw new Error(`Failed to fetch community recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 