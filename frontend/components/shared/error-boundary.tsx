"use client"

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  componentStack?: string
}

function DefaultErrorFallback({ error, resetError, componentStack }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto mt-8 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
        <CardDescription>
          An error occurred while rendering this component. You can try refreshing or contact support if the problem persists.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Error details
          </summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
            {error.message}
            {componentStack ? `\n\nComponent Stack:${componentStack}` : ''}
          </pre>
        </details>
        <Button onClick={resetError} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // Reset error state when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => prevProps.resetKeys![index] !== key
      )
      if (hasResetKeyChanged) {
        this.resetError()
      }
    }

    // Reset error state when any prop changes if resetOnPropsChange is true
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetError()
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    }, 0)
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback: Fallback = DefaultErrorFallback } = this.props

    if (hasError && error) {
      return (
        <Fallback
          error={error}
          resetError={this.resetError}
          componentStack={errorInfo?.componentStack || undefined}
        />
      )
    }

    return children
  }
}

// Convenience hook for error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Manual error report:', error, errorInfo)
    // Here you could integrate with error reporting services like Sentry
  }, [])
} 