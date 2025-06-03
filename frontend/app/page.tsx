"use client"

import { useVibeBar } from "@/hooks/use-vibe-bar"
import { LandingView } from "@/components/views/landing-view"
// Import other views as they're created
// import { RecipeView } from "@/components/views/recipe-view"
// import { SavedRecipesView } from "@/components/views/saved-recipes-view"
// import { MyBarView } from "@/components/views/my-bar-view"
// import { ProfileView } from "@/components/views/profile-view"

export default function VibeBarApp() {
  const {
    currentView,
    setCurrentView,
    selectedIngredients,
    selectedFlavors,
    toggleIngredient,
    toggleFlavor,
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
          toggleIngredient={toggleIngredient}
          toggleFlavor={toggleFlavor}
        />
      )
    
    case "recipe":
      return <div>Recipe View - To be created</div>
      // return <RecipeView currentView={currentView} setCurrentView={setCurrentView} />
    
    case "saved":
      return <div>Saved Recipes View - To be created</div>
      // return <SavedRecipesView currentView={currentView} setCurrentView={setCurrentView} />
    
    case "mybar":
      return <div>My Bar View - To be created</div>
      // return <MyBarView currentView={currentView} setCurrentView={setCurrentView} />
    
    case "profile":
      return <div>Profile View - To be created</div>
      // return <ProfileView currentView={currentView} setCurrentView={setCurrentView} />
    
    default:
      return (
        <LandingView
          currentView={currentView}
          setCurrentView={setCurrentView}
          selectedIngredients={selectedIngredients}
          selectedFlavors={selectedFlavors}
          toggleIngredient={toggleIngredient}
          toggleFlavor={toggleFlavor}
        />
      )
  }
}
