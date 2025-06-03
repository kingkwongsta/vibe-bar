"use client"

import { useVibeBar } from "@/hooks/use-vibe-bar"
import { LandingView } from "@/components/views/landing-view"
import { RecipeView } from "@/components/views/recipe-view"
import { SavedRecipesView } from "@/components/views/saved-recipes-view"
import { MyBarView } from "@/components/views/my-bar-view"
import { ProfileView } from "@/components/views/profile-view"
// Import other views as they're created
// import { MyBarView } from "@/components/views/my-bar-view"
// import { ProfileView } from "@/components/views/profile-view"

export default function VibeBarApp() {
  const {
    currentView,
    setCurrentView,
    selectedIngredients,
    selectedFlavors,
    customIngredients,
    customIngredientInput,
    toggleIngredient,
    toggleFlavor,
    addCustomIngredient,
    removeCustomIngredient,
    setCustomIngredientInput,
    getFormData,
    resetForm,
  } = useVibeBar()

  // Render the appropriate view based on currentView
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
          toggleIngredient={toggleIngredient}
          toggleFlavor={toggleFlavor}
          addCustomIngredient={addCustomIngredient}
          removeCustomIngredient={removeCustomIngredient}
          setCustomIngredientInput={setCustomIngredientInput}
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
          toggleIngredient={toggleIngredient}
          toggleFlavor={toggleFlavor}
          addCustomIngredient={addCustomIngredient}
          removeCustomIngredient={removeCustomIngredient}
          setCustomIngredientInput={setCustomIngredientInput}
        />
      )
  }
}
