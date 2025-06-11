"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationBar } from "@/components/layout/navigation-bar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Clock,
  Users,
  Zap,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"
import { useState, useEffect } from "react"
import { getCommunityRecipes, type CommunityRecipe, type CocktailRecipe } from "@/lib/api"
import { INGREDIENTS } from "@/lib/constants"

export function CommunityView() {
  const { setCurrentView, setGeneratedRecipe } = useVibeBarContext()
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [spiritFilter, setSpiritFilter] = useState("all")
  
  // Fetch community recipes
  const fetchRecipes = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      // Explicitly sort by created_at desc to show latest recipes first
      const response = await getCommunityRecipes(page, 12, "created_at", "desc")
      
      if (response.success && response.data) {
        setRecipes(response.data.recipes)
        setTotalCount(response.data.total_count)
        setCurrentPage(response.data.page)
      } else {
        throw new Error(response.message || 'Failed to fetch recipes')
      }
    } catch (err) {
      console.error('Failed to fetch community recipes:', err)
      setError(err instanceof Error ? err.message : 'Failed to load community recipes')
    } finally {
      setLoading(false)
    }
  }

  // Load recipes on component mount
  useEffect(() => {
    fetchRecipes()
  }, [])

  // Filter recipes based on search and spirit
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchTerm === "" || 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSpirit = spiritFilter === "all" || 
      recipe.name.toLowerCase().includes(spiritFilter.toLowerCase()) ||
      recipe.description.toLowerCase().includes(spiritFilter.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(spiritFilter.toLowerCase()))
    
    return matchesSearch && matchesSpirit
  })

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      case 'expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Detect the primary spirit in a recipe
  const detectSpirit = (recipe: CommunityRecipe): string | null => {
    const searchText = `${recipe.name} ${recipe.description} ${recipe.tags.join(' ')}`.toLowerCase()
    
    // Check each ingredient (spirit) to see if it appears in the recipe
    for (const ingredient of INGREDIENTS) {
      if (ingredient.toLowerCase() !== 'non-alcoholic' && 
          searchText.includes(ingredient.toLowerCase())) {
        return ingredient
      }
    }
    
    // Check for non-alcoholic last
    if (searchText.includes('non-alcoholic') || searchText.includes('mocktail')) {
      return 'Non-Alcoholic'
    }
    
    return null
  }
  
  // Convert CommunityRecipe to CocktailRecipe format for display in RecipeView
  const convertCommunityRecipeToDisplay = (communityRecipe: CommunityRecipe): CocktailRecipe => {
    return {
      recipeTitle: communityRecipe.name,
      recipeDescription: communityRecipe.description,
      recipeMeta: communityRecipe.meta && communityRecipe.meta.length > 0 
        ? communityRecipe.meta 
        : [
            { text: communityRecipe.prep_time_minutes ? `${communityRecipe.prep_time_minutes} min` : "Unknown prep time" },
            { text: communityRecipe.difficulty_level || "Unknown difficulty" },
            { text: communityRecipe.servings ? `${communityRecipe.servings} serving${communityRecipe.servings > 1 ? 's' : ''}` : "Unknown serving" }
          ],
      recipeIngredients: communityRecipe.ingredients,
      recipeInstructions: communityRecipe.instructions,
      recipeDetails: communityRecipe.details && communityRecipe.details.length > 0 
        ? communityRecipe.details 
        : [
            { title: "Glassware", content: "Standard cocktail glass" },
            { title: "Garnish", content: "As desired" }
          ]
    }
  }

  // Handle viewing a community recipe
  const handleViewRecipe = (recipe: CommunityRecipe) => {
    const displayRecipe = convertCommunityRecipeToDisplay(recipe)
    setGeneratedRecipe(displayRecipe)
    setCurrentView("recipe")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Recipes</h1>
          <p className="text-gray-600">Discover amazing cocktails created by our community</p>
          {totalCount > 0 && (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-gray-500">{totalCount} recipes in the community</p>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search recipes, ingredients, or tags..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={spiritFilter} onValueChange={setSpiritFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by spirit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All spirits</SelectItem>
                  <SelectItem value="vodka">Vodka</SelectItem>
                  <SelectItem value="gin">Gin</SelectItem>
                  <SelectItem value="rum">Rum</SelectItem>
                  <SelectItem value="tequila">Tequila</SelectItem>
                  <SelectItem value="whiskey">Whiskey</SelectItem>
                  <SelectItem value="bourbon">Bourbon</SelectItem>
                  <SelectItem value="non-alcoholic">Non-Alcoholic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0">
            <CardContent>
              <Loader2 className="h-8 w-8 text-amber-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Community Recipes</h3>
              <p className="text-gray-600">Fetching the latest cocktails from our community...</p>
            </CardContent>
          </Card>
        )}

        {/* Recipe Grid */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm border-0"
              >
                <CardHeader>
                  <CardTitle className="text-lg mb-2">{recipe.name}</CardTitle>
                  <div className="flex gap-6 text-xs text-gray-600 mb-2">
                    {recipe.prep_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prep_time_minutes} min
                      </span>
                    )}
                    {recipe.creator_name && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {recipe.creator_name}
                      </span>
                    )}
                    <span>{formatDate(recipe.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {detectSpirit(recipe) && (
                        <Badge className="text-xs bg-orange-100 text-orange-800">
                          {detectSpirit(recipe)}
                        </Badge>
                      )}
                      {recipe.difficulty_level && (
                        <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty_level)}`}>
                          {recipe.difficulty_level}
                        </Badge>
                      )}
                      {recipe.vibe && (
                        <Badge variant="outline" className="text-xs">
                          {recipe.vibe}
                        </Badge>
                      )}
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {recipe.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button size="sm" className="w-full bg-orange-400 hover:bg-orange-600 text-white" onClick={() => handleViewRecipe(recipe)}>
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRecipes.length === 0 && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || spiritFilter !== "all" ? "No recipes match your search" : "No community recipes yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || spiritFilter !== "all" 
                  ? "Try adjusting your search terms or filters" 
                  : "Be the first to share a cocktail with the community!"
                }
              </p>
              {(!searchTerm && spiritFilter === "all") && (
                <Button onClick={() => setCurrentView("landing")}>
                  <Zap className="h-4 w-4 mr-2" />
                  Create Your First Recipe
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pagination (if needed later) */}
        {!loading && totalCount > 12 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchRecipes(currentPage + 1)}
              disabled={currentPage * 12 >= totalCount}
            >
              Load More Recipes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 