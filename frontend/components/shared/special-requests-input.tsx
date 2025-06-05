"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"
import { useFormValidation } from "@/hooks/use-form-validation"

export function SpecialRequestsInput() {
  const {
    specialRequests,
    updateSpecialRequests,
  } = useVibeBarContext()

  const {
    validateSpecialRequestsInput,
    getError,
  } = useFormValidation()

  const handleSpecialRequestsChange = (requests: string) => {
    // Always update the special requests to allow spaces
    updateSpecialRequests(requests)
    
    // Run validation for error display but don't use sanitized version
    validateSpecialRequestsInput(requests)
  }

  return (
    <div>
      <Label className="text-lg font-semibold mb-4 block">Special Requests</Label>
      <div className="space-y-2">
        <Input
          placeholder="Any special dietary restrictions, preferences, or requests?"
          value={specialRequests}
          onChange={(e) => handleSpecialRequestsChange(e.target.value)}
          className={getError('specialRequests') ? 'border-red-500' : ''}
          maxLength={100}
        />
        <div className="flex justify-between items-center">
          {getError('specialRequests') ? (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getError('specialRequests')}
            </p>
          ) : (
            <div />
          )}
          <span className="text-xs text-gray-500">
            {specialRequests.length}/100
          </span>
        </div>
      </div>
    </div>
  )
} 