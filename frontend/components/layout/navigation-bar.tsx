import React from "react"
import { Wine, Home, Heart, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
              <Home className="h-4 w-4 inline mr-1" />
              Create
            </button>
            <button
              onClick={() => setCurrentView("saved")}
              className={`text-sm font-medium transition-colors ${
                currentView === "saved" 
                  ? "text-amber-600" 
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <Heart className="h-4 w-4 inline mr-1" />
              Saved
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className={`text-sm font-medium transition-colors ${
                currentView === "profile" 
                  ? "text-amber-600" 
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <User className="h-4 w-4 inline mr-1" />
              Profile
            </button>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}) 