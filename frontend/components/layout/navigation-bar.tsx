import React from "react"
import { Wine, Sparkles, Users } from "lucide-react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"

export const NavigationBar = React.memo(function NavigationBar() {
  const { currentView, setCurrentView } = useVibeBarContext()
  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => setCurrentView("landing")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Wine className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Vibe Bar
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView("landing")}
              className={`text-sm font-medium transition-colors ${
                currentView === "landing" 
                  ? "text-amber-600" 
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <Sparkles className="h-4 w-4 inline mr-1" />
              Create
            </button>
            <button
              onClick={() => setCurrentView("community")}
              className={`text-sm font-medium transition-colors ${
                currentView === "community" 
                  ? "text-amber-600" 
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" />
              Community
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}) 