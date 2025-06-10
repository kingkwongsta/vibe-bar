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