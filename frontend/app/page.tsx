"use client"

import { LandingView } from "@/components/views/landing-view"
import { RecipeView } from "@/components/views/recipe-view"
import { SavedRecipesView } from "@/components/views/saved-recipes-view"
import { CommunityView } from "@/components/views/community-view"
import { ProfileView } from "@/components/views/profile-view"
import { DevLogger } from "@/components/debug/dev-logger"
import { useVibeBarContext } from "./context/vibe-bar-context"

export default function VibeBarApp() {
  const { currentView, prepareLLMPrompt } = useVibeBarContext()

  // Function to render the appropriate view based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingView />
      
      case "recipe":
        return <RecipeView />
      
      case "saved":
        return <SavedRecipesView />
      
      case "community":
        return <CommunityView />
      
      case "profile":
        return <ProfileView />
      
      default:
        return <LandingView />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
      {renderCurrentView()}
      
      {/* Development logger - only shows in dev mode */}
      <DevLogger onGeneratePrompt={prepareLLMPrompt} />
    </div>
  )
}
