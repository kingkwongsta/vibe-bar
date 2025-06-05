"use client"

import React from 'react'
import { useUrlStateSync, useShareableUrl } from '@/hooks/use-url-sync'
import { useCurrentView, useFormState, useFormActions } from '@/store/vibe-bar-store'
import { NavigationBarZustand } from '@/components/layout/navigation-bar-zustand'
import { LandingView } from '@/components/views/landing-view'
import { RecipeView } from '@/components/views/recipe-view'
import { SavedRecipesView } from '@/components/views/saved-recipes-view'
import { ProfileView } from '@/components/views/profile-view'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { PerformanceMonitor } from '@/components/debug/performance-monitor'

// URL state restoration notification
function UrlStateRestoredAlert() {
  const { isFormRestored } = useFormState()
  const { setFormRestored } = useFormActions()

  if (!isFormRestored) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 mx-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-blue-600 mr-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Form state restored
            </h3>
            <p className="text-sm text-blue-600">
              Your previous selections have been restored from the URL or local storage.
            </p>
          </div>
        </div>
        <button
          onClick={() => setFormRestored(false)}
          className="text-blue-400 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Share button component for easy sharing
function ShareCurrentState() {
  const { getShareableUrl, copyToClipboard } = useShareableUrl()
  const currentView = useCurrentView()

  const handleShare = async () => {
    const result = await copyToClipboard()
    if (result.success) {
      // Show success notification (could be enhanced with a toast library)
      console.log('✅ URL copied to clipboard!')
    }
  }

  // Only show share button if we're not on the default landing view without state
  const showShare = currentView !== 'landing' || getShareableUrl().includes('?')

  if (!showShare) return null

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={handleShare}
        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Share
      </button>
    </div>
  )
}

// Main app component with URL synchronization
export function AppWithUrlSync() {
  // Initialize URL synchronization
  useUrlStateSync()
  
  const currentView = useCurrentView()

  const renderCurrentView = () => {
    switch (currentView) {
      case 'recipe':
        return <RecipeView />
      case 'saved':
        return <SavedRecipesView />
      case 'profile':
        return <ProfileView />
      case 'landing':
      default:
        return <LandingView />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <ErrorBoundary>
        <NavigationBarZustand />
      </ErrorBoundary>

      {/* URL State Restoration Alert */}
      <ErrorBoundary>
        <UrlStateRestoredAlert />
      </ErrorBoundary>

      {/* Main Content */}
      <ErrorBoundary>
        {renderCurrentView()}
      </ErrorBoundary>

      {/* Share Button */}
      <ErrorBoundary>
        <ShareCurrentState />
      </ErrorBoundary>

      {/* Performance Monitor (development only) */}
      <PerformanceMonitor />
    </div>
  )
}

// Component is ready to use with all required imports 