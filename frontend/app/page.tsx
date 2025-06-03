"use client"

import { useVibeBar } from "@/hooks/use-vibe-bar"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { LandingView } from "@/components/views/landing-view"
import { RecipeView } from "@/components/views/recipe-view"
import { SavedRecipesView } from "@/components/views/saved-recipes-view"
import { MyBarView } from "@/components/views/my-bar-view"
import { ProfileView } from "@/components/views/profile-view"
import { DevLogger } from "@/components/debug/dev-logger"

export default function VibeBarApp() {
  const {
    currentView,
    setCurrentView,
    selectedIngredients,
    selectedFlavors,
    customIngredients,
    customIngredientInput,
    selectedAlcoholStrength,
    selectedVibe,
    toggleIngredient,
    toggleFlavor,
    addCustomIngredient,
    removeCustomIngredient,
    setCustomIngredientInput,
    setAlcoholStrength,
    setVibe,
    getFormData,
    resetForm,
  } = useVibeBar()

  const { preferences } = useUserPreferences()

  // Function to render the appropriate view based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return (
          <LandingView
            currentView={currentView}
            setCurrentView={setCurrentView}
            selectedIngredients={selectedIngredients}
            selectedFlavors={selectedFlavors}
            customIngredients={customIngredients}
            customIngredientInput={customIngredientInput}
            selectedAlcoholStrength={selectedAlcoholStrength}
            selectedVibe={selectedVibe}
            toggleIngredient={toggleIngredient}
            toggleFlavor={toggleFlavor}
            addCustomIngredient={addCustomIngredient}
            removeCustomIngredient={removeCustomIngredient}
            setCustomIngredientInput={setCustomIngredientInput}
            setAlcoholStrength={setAlcoholStrength}
            setVibe={setVibe}
            userPreferences={preferences}
          />
        )
      
      case "recipe":
        return <RecipeView currentView={currentView} setCurrentView={setCurrentView} />
      
      case "saved":
        return <SavedRecipesView currentView={currentView} setCurrentView={setCurrentView} />
      
      case "mybar":
        return <MyBarView currentView={currentView} setCurrentView={setCurrentView} />
      
      case "profile":
        return <ProfileView currentView={currentView} setCurrentView={setCurrentView} />
      
      default:
        return (
          <LandingView
            currentView={currentView}
            setCurrentView={setCurrentView}
            selectedIngredients={selectedIngredients}
            selectedFlavors={selectedFlavors}
            customIngredients={customIngredients}
            customIngredientInput={customIngredientInput}
            selectedAlcoholStrength={selectedAlcoholStrength}
            selectedVibe={selectedVibe}
            toggleIngredient={toggleIngredient}
            toggleFlavor={toggleFlavor}
            addCustomIngredient={addCustomIngredient}
            removeCustomIngredient={removeCustomIngredient}
            setCustomIngredientInput={setCustomIngredientInput}
            setAlcoholStrength={setAlcoholStrength}
            setVibe={setVibe}
            userPreferences={preferences}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
      {renderCurrentView()}
      
      {/* Development logger - only shows in dev mode */}
      <DevLogger />
    </div>
  )
}
