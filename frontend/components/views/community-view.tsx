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
  Star,
  Clock,
  Share2,
  Users,
  Zap,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"
import { useState, useEffect } from "react"
import { getCommunityRecipes, type CommunityRecipe } from "@/lib/api"

export function CommunityView() {
  const { setCurrentView } = useVibeBarContext()
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  
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

  // Filter recipes based on search and rating
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchTerm === "" || 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRating = ratingFilter === "all" || 
      (recipe.rating_average && recipe.rating_average >= parseInt(ratingFilter))
    
    return matchesSearch && matchesRating
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
              <span className="text-sm text-gray-400">•</span>
              <p className="text-sm text-gray-500">Sorted by newest first</p>
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
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
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
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <div className="flex">
                      {recipe.rating_average ? (
                        [...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(recipe.rating_average!) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No ratings yet</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-600 mb-2">
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
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-2">
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
                    </div>
                    <div className="flex flex-wrap gap-1">
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
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>{formatDate(recipe.created_at)}</span>
                    {recipe.ai_model_used && (
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        AI Generated
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setCurrentView("recipe")}>
                      View Recipe
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-3 w-3" />
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
                {searchTerm || ratingFilter !== "all" ? "No recipes match your search" : "No community recipes yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || ratingFilter !== "all" 
                  ? "Try adjusting your search terms or filters" 
                  : "Be the first to share a cocktail with the community!"
                }
              </p>
              {(!searchTerm && ratingFilter === "all") && (
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