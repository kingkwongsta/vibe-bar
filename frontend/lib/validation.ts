// Input validation and sanitization utilities

// Constants for validation rules
export const VALIDATION_RULES = {
  CUSTOM_INGREDIENT: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9\s\-'().]+$/,
  },
  SPECIAL_REQUESTS: {
    MAX_LENGTH: 500,
    PATTERN: /^[a-zA-Z0-9\s\-'(),.!?]+$/,
  },
  MAX_CUSTOM_INGREDIENTS: 10,
  MAX_SELECTED_INGREDIENTS: 15,
  MAX_SELECTED_FLAVORS: 8,
} as const

export interface ValidationResult {
  isValid: boolean
  error?: string
  sanitized?: string
}

/**
 * Sanitizes text input by removing harmful characters and trimming
 */
export function sanitizeTextInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
}

/**
 * Validates custom ingredient input
 */
export function validateCustomIngredient(
  ingredient: string,
  existingIngredients: string[] = [],
  existingCustomIngredients: string[] = []
): ValidationResult {
  const sanitized = sanitizeTextInput(ingredient)
  
  if (!sanitized) {
    return { isValid: false, error: "Ingredient name cannot be empty" }
  }
  
  if (sanitized.length < VALIDATION_RULES.CUSTOM_INGREDIENT.MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Ingredient name must be at least ${VALIDATION_RULES.CUSTOM_INGREDIENT.MIN_LENGTH} characters` 
    }
  }
  
  if (sanitized.length > VALIDATION_RULES.CUSTOM_INGREDIENT.MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Ingredient name must be less than ${VALIDATION_RULES.CUSTOM_INGREDIENT.MAX_LENGTH} characters` 
    }
  }
  
  if (!VALIDATION_RULES.CUSTOM_INGREDIENT.PATTERN.test(sanitized)) {
    return { 
      isValid: false, 
      error: "Ingredient name contains invalid characters" 
    }
  }
  
  // Check for duplicates (case-insensitive)
  const lowerSanitized = sanitized.toLowerCase()
  const allExisting = [...existingIngredients, ...existingCustomIngredients]
    .map(item => item.toLowerCase())
  
  if (allExisting.includes(lowerSanitized)) {
    return { 
      isValid: false, 
      error: "This ingredient has already been added" 
    }
  }
  
  // Check custom ingredients limit
  if (existingCustomIngredients.length >= VALIDATION_RULES.MAX_CUSTOM_INGREDIENTS) {
    return { 
      isValid: false, 
      error: `Maximum ${VALIDATION_RULES.MAX_CUSTOM_INGREDIENTS} custom ingredients allowed` 
    }
  }
  
  return { isValid: true, sanitized }
}

/**
 * Validates special requests input
 */
export function validateSpecialRequests(requests: string): ValidationResult {
  const sanitized = sanitizeTextInput(requests)
  
  if (sanitized.length > VALIDATION_RULES.SPECIAL_REQUESTS.MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Special requests must be less than ${VALIDATION_RULES.SPECIAL_REQUESTS.MAX_LENGTH} characters` 
    }
  }
  
  if (sanitized && !VALIDATION_RULES.SPECIAL_REQUESTS.PATTERN.test(sanitized)) {
    return { 
      isValid: false, 
      error: "Special requests contain invalid characters" 
    }
  }
  
  return { isValid: true, sanitized }
}

/**
 * Validates array selections against limits
 */
export function validateSelectionLimits(
  selectedIngredients: string[],
  selectedFlavors: string[]
): ValidationResult {
  if (selectedIngredients.length > VALIDATION_RULES.MAX_SELECTED_INGREDIENTS) {
    return { 
      isValid: false, 
      error: `Maximum ${VALIDATION_RULES.MAX_SELECTED_INGREDIENTS} ingredients can be selected` 
    }
  }
  
  if (selectedFlavors.length > VALIDATION_RULES.MAX_SELECTED_FLAVORS) {
    return { 
      isValid: false, 
      error: `Maximum ${VALIDATION_RULES.MAX_SELECTED_FLAVORS} flavors can be selected` 
    }
  }
  
  return { isValid: true }
}

/**
 * Validates that required selections are made for recipe generation
 */
export function validateRecipeGeneration(formData: {
  selectedIngredients: string[]
  selectedFlavors: string[]
  customIngredients: string[]
}): ValidationResult {
  const totalIngredients = formData.selectedIngredients.length + formData.customIngredients.length
  
  if (totalIngredients === 0) {
    return { 
      isValid: false, 
      error: "Please select at least one ingredient to generate a recipe" 
    }
  }
  
  if (formData.selectedFlavors.length === 0) {
    return { 
      isValid: false, 
      error: "Please select at least one flavor profile" 
    }
  }
  
  return { isValid: true }
} 