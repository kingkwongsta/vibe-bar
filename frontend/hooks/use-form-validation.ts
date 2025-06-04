import { useState, useCallback } from "react"
import { 
  validateCustomIngredient, 
  validateSpecialRequests, 
  validateSelectionLimits,
  validateRecipeGeneration,
  type ValidationResult 
} from "@/lib/validation"

interface FormErrors {
  customIngredient?: string
  specialRequests?: string
  selectionLimits?: string
  recipeGeneration?: string
}

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isValidating, setIsValidating] = useState(false)

  const clearError = useCallback((field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setError = useCallback((field: keyof FormErrors, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const validateCustomIngredientInput = useCallback((
    ingredient: string,
    existingIngredients: string[],
    existingCustomIngredients: string[]
  ): ValidationResult => {
    clearError('customIngredient')
    
    const result = validateCustomIngredient(ingredient, existingIngredients, existingCustomIngredients)
    
    if (!result.isValid && result.error) {
      setError('customIngredient', result.error)
    }
    
    return result
  }, [clearError, setError])

  const validateSpecialRequestsInput = useCallback((requests: string): ValidationResult => {
    clearError('specialRequests')
    
    const result = validateSpecialRequests(requests)
    
    if (!result.isValid && result.error) {
      setError('specialRequests', result.error)
    }
    
    return result
  }, [clearError, setError])

  const validateSelectionLimitsInput = useCallback((
    selectedIngredients: string[],
    selectedFlavors: string[]
  ): ValidationResult => {
    clearError('selectionLimits')
    
    const result = validateSelectionLimits(selectedIngredients, selectedFlavors)
    
    if (!result.isValid && result.error) {
      setError('selectionLimits', result.error)
    }
    
    return result
  }, [clearError, setError])

  const validateRecipeGenerationInput = useCallback((formData: {
    selectedIngredients: string[]
    selectedFlavors: string[]
    customIngredients?: string
  }): ValidationResult => {
    setIsValidating(true)
    clearError('recipeGeneration')
    
    const result = validateRecipeGeneration(formData)
    
    if (!result.isValid && result.error) {
      setError('recipeGeneration', result.error)
    }
    
    setIsValidating(false)
    return result
  }, [clearError, setError])

  const hasErrors = useCallback((): boolean => {
    return Object.keys(errors).length > 0
  }, [errors])

  const getError = useCallback((field: keyof FormErrors): string | undefined => {
    return errors[field]
  }, [errors])

  return {
    errors,
    isValidating,
    clearError,
    clearAllErrors,
    validateCustomIngredientInput,
    validateSpecialRequestsInput,
    validateSelectionLimitsInput,
    validateRecipeGenerationInput,
    hasErrors,
    getError,
  }
} 