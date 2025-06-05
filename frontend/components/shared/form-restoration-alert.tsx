"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"

export function FormRestorationAlert() {
  const { isFormRestored } = useVibeBarContext()

  if (!isFormRestored) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          We&apos;ve restored your previous selections. Continue where you left off!
        </AlertDescription>
      </Alert>
    </div>
  )
} 