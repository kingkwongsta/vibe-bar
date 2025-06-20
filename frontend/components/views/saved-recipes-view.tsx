"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationBar } from "@/components/layout/navigation-bar"
import {
  Search,
  Clock,
  Share2,
  Heart,
  Zap,
} from "lucide-react"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"

// Sample data for saved recipes
const savedRecipes = [
  {
    id: 1,
    name: "Sunset Serenity",
    spirit: "Tequila",
    time: "3 min",
    ingredients: ["Tequila", "Pineapple", "Lime", "Jalapeño"]
  },
  {
    id: 2,
    name: "Midnight Manhattan",
    spirit: "Whiskey",
    time: "5 min",
    ingredients: ["Whiskey", "Vermouth", "Bitters", "Cherry"]
  },
  {
    id: 3,
    name: "Tropical Storm",
    spirit: "Rum",
    time: "4 min",
    ingredients: ["Rum", "Coconut", "Mango", "Lime"]
  },
  {
    id: 4,
    name: "Smoky Old Soul",
    spirit: "Bourbon",
    time: "8 min",
    ingredients: ["Bourbon", "Maple", "Orange", "Rosemary"]
  },
  {
    id: 5,
    name: "Garden Gimlet",
    spirit: "Gin",
    time: "6 min",
    ingredients: ["Gin", "Cucumber", "Basil", "Lime"]
  },
  {
    id: 6,
    name: "Spiced Pear Fizz",
    spirit: "Vodka",
    time: "4 min",
    ingredients: ["Vodka", "Pear", "Cinnamon", "Ginger"]
  }
]

export function SavedRecipesView() {
  const { setCurrentView } = useVibeBarContext()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Recipes</h1>
          <p className="text-gray-600">Your personal collection of favorite cocktails</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search your recipes..." className="pl-10" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by spirit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All spirits</SelectItem>
                  <SelectItem value="gin">Gin</SelectItem>
                  <SelectItem value="whiskey">Whiskey</SelectItem>
                  <SelectItem value="bourbon">Bourbon</SelectItem>
                  <SelectItem value="rum">Rum</SelectItem>
                  <SelectItem value="tequila">Tequila</SelectItem>
                  <SelectItem value="vodka">Vodka</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm border-0"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                </div>
                <div className="flex gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.time}
                  </span>
                  <span>• {recipe.spirit}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Key ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
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

        {/* Empty State (if no recipes) */}
        {savedRecipes.length === 0 && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0">
            <CardContent>
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved recipes yet</h3>
              <p className="text-gray-600 mb-4">Start generating cocktails and save your favorites!</p>
              <Button onClick={() => setCurrentView("landing")}>
                <Zap className="h-4 w-4 mr-2" />
                Generate Your First Cocktail
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 