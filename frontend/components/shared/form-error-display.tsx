"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useFormValidation } from "@/hooks/use-form-validation"

export function FormErrorDisplay() {
  const { getError } = useFormValidation()

  // Only render if there are selection limit errors
  const selectionLimitsError = getError('selectionLimits')
  
  if (!selectionLimitsError) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{selectionLimitsError}</AlertDescription>
      </Alert>
    </div>
  )
} 