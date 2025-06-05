"use client"

import { useCallback, useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  totalRenderTime: number
}

interface UsePerformanceMonitorOptions {
  logToConsole?: boolean
  componentName?: string
  throttleMs?: number
}

export function usePerformanceMonitor(
  componentName = 'Unknown Component',
  options: UsePerformanceMonitorOptions = {}
) {
  const { logToConsole = false, throttleMs = 1000 } = options
  const metrics = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
  })
  const lastLogTime = useRef(0)
  const renderStartTime = useRef(performance.now())

  // Track render start
  renderStartTime.current = performance.now()

  useEffect(() => {
    // Track render end
    const renderEndTime = performance.now()
    const renderDuration = renderEndTime - renderStartTime.current

    // Update metrics
    metrics.current.renderCount += 1
    metrics.current.lastRenderTime = renderDuration
    metrics.current.totalRenderTime += renderDuration
    metrics.current.averageRenderTime = 
      metrics.current.totalRenderTime / metrics.current.renderCount

    // Log to console if enabled and throttled
    if (logToConsole && renderEndTime - lastLogTime.current > throttleMs) {
      console.log(`[Performance] ${componentName}:`, {
        renders: metrics.current.renderCount,
        lastRender: `${renderDuration.toFixed(2)}ms`,
        avgRender: `${metrics.current.averageRenderTime.toFixed(2)}ms`,
        totalTime: `${metrics.current.totalRenderTime.toFixed(2)}ms`,
      })
      lastLogTime.current = renderEndTime
    }
  }, [logToConsole, throttleMs, componentName])

  const getMetrics = useCallback(() => ({ ...metrics.current }), [])

  const resetMetrics = useCallback(() => {
    metrics.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      totalRenderTime: 0,
    }
  }, [])

  return { getMetrics, resetMetrics }
}

// Hook to track why a component re-rendered
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>()

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: any; to: any }> = {}

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changedProps).length) {
        console.log('[WhyDidYouUpdate]', name, changedProps)
      }
    }

    previousProps.current = props
  }, [name, props])
}

// Hook to measure async operation performance
export function useAsyncPerformance() {
  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`[Async Performance] ${operationName}: ${duration.toFixed(2)}ms`)
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.error(`[Async Performance] ${operationName} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }, [])

  return { measureAsync }
}

// Hook to track component mount/unmount cycles
export function useLifecycleLogger(componentName: string) {
  useEffect(() => {
    console.log(`[Lifecycle] ${componentName} mounted`)
    
    return () => {
      console.log(`[Lifecycle] ${componentName} unmounted`)
    }
  }, [componentName])
} 