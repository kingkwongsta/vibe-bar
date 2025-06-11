import { useState, useCallback } from 'react'

interface ShareData {
  title?: string
  text?: string
  url?: string
}

interface UseShareReturn {
  isShared: boolean
  share: (data?: ShareData) => Promise<boolean>
  copyToClipboard: (text: string) => Promise<boolean>
}

export function useShare(): UseShareReturn {
  const [isShared, setIsShared] = useState(false)

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }, [])

  const share = useCallback(async (data?: ShareData): Promise<boolean> => {
    const shareData = {
      title: data?.title || document.title,
      text: data?.text || '',
      url: data?.url || window.location.href,
    }

    try {
      // Check if Web Share API is supported and can share the data
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        return true
      }
      
      // Fallback to copying URL to clipboard
      return await copyToClipboard(shareData.url)
      
    } catch (error) {
      console.error('Error sharing:', error)
      // Final fallback: try to copy URL
      return await copyToClipboard(shareData.url)
    }
  }, [copyToClipboard])

  return {
    isShared,
    share,
    copyToClipboard,
  }
} 