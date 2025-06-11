"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Share2, Copy, Check, ExternalLink } from 'lucide-react'
import { useRecipeShare, useFormBookmark } from '@/hooks/use-url-sync'
import type { CocktailRecipe } from '@/lib/api'

interface RecipeShareButtonProps {
  recipe?: CocktailRecipe
  recipeId?: string
  variant?: 'button' | 'card'
  size?: 'sm' | 'lg' | 'default'
}

export function RecipeShareButton({ 
  recipe, 
  recipeId, 
  variant = 'button',
  size = 'default' 
}: RecipeShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const { copyRecipeUrl } = useRecipeShare()
  const { createBookmark, getBookmarkableState } = useFormBookmark()

  const handleShare = async () => {
    const result = await copyRecipeUrl(recipeId)
    if (result.success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      console.error('Failed to share recipe:', result.error)
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return

    try {
      const result = await copyRecipeUrl(recipeId)
      if (result.success && result.url) {
        await navigator.share({
          title: recipe?.recipeTitle || 'Cocktail Recipe',
          text: recipe?.recipeDescription || 'Check out this cocktail recipe!',
          url: result.url,
        })
      }
    } catch (error) {
      console.error('Failed to share:', error)
      // Fall back to copy
      handleShare()
    }
  }

  const handleBookmark = () => {
    const bookmarkableState = getBookmarkableState()
    if (bookmarkableState) {
      const bookmark = createBookmark(`${recipe?.recipeTitle} ingredients`)
      console.log('Bookmark created:', bookmark)
      // Could save to localStorage or show success message
    }
  }

  // Button variant
  if (variant === 'button') {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowShareOptions(!showShareOptions)}
          variant="outline"
          size={size}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        {showShareOptions && (
          <Card className="absolute top-full right-0 mt-2 w-64 z-50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Share Recipe</CardTitle>
              <CardDescription className="text-xs">
                Share this recipe with others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  onClick={handleNativeShare}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share via...
                </Button>
              )}
              
              <Button
                onClick={handleBookmark}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Badge variant="outline" className="mr-2">
                  Save
                </Badge>
                Bookmark Form State
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Card variant - expanded sharing options
  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Share2 className="h-5 w-5" />
          Share This Recipe
        </CardTitle>
        <CardDescription>
          Share this cocktail recipe with friends or save your ingredient preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipe URL Sharing */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recipe Link</h4>
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Recipe Link'}
            </Button>
            
                         {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                onClick={handleNativeShare}
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Form State Bookmark */}
        {getBookmarkableState() && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Save Preferences</h4>
            <Button
              onClick={handleBookmark}
              variant="outline"
              className="w-full"
            >
              <Badge variant="secondary" className="mr-2">
                Bookmark
              </Badge>
              Save Current Selections
            </Button>
            <p className="text-xs text-gray-600">
              Creates a shareable link with your current ingredient and flavor selections
            </p>
          </div>
        )}

        {/* Social Media Hints */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            💡 Tip: The shared link includes all recipe details and your custom preferences
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick share hook for other components
export function useQuickShare() {
  const [copying, setCopying] = useState(false)
  const { copyRecipeUrl } = useRecipeShare()

  const quickShare = async (recipeId?: string) => {
    if (copying) return { success: false, error: 'Already copying' }
    
    setCopying(true)
    try {
      const result = await copyRecipeUrl(recipeId)
      setTimeout(() => setCopying(false), 1000)
      return result
    } catch (error) {
      setCopying(false)
      return { success: false, error }
    }
  }

  return { quickShare, copying }
} 