import React from "react"
import { Wine, Home, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCurrentView, useVibeBarStore } from "@/store/vibe-bar-store"
import { useShareableUrl } from "@/hooks/use-url-sync"

export const NavigationBarZustand = React.memo(function NavigationBarZustand() {
  const currentView = useCurrentView()
  const setCurrentView = useVibeBarStore((state) => state.setCurrentView)
  const { copyToClipboard } = useShareableUrl()

  const handleShare = async () => {
    const result = await copyToClipboard()
    if (result.success) {
      // Could show a toast notification here
      console.log('URL copied to clipboard:', result.url)
    } else {
      console.error('Failed to copy URL:', result.error)
    }
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Wine className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Vibe Bar
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView("landing")}
              className={`text-sm font-medium transition-colors ${
                currentView === "landing" 
                  ? "text-amber-600" 
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <Home className="h-4 w-4 inline mr-1" />
              Create
            </button>
            
            {/* Share button */}
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-amber-600"
            >
              <Link className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}) 