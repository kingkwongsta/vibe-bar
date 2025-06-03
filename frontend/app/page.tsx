"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Wine,
  Sparkles,
  Clock,
  Users,
  Heart,
  Share2,
  Star,
  Plus,
  Search,
  Settings,
  BookOpen,
  ChefHat,
  Zap,
  User,
  Home,
} from "lucide-react"

export default function VibeBarMockups() {
  const [currentView, setCurrentView] = useState("landing")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])

  const ingredients = [
    "Vodka",
    "Gin",
    "Rum",
    "Tequila",
    "Whiskey",
    "Bourbon",
    "Lime Juice",
    "Lemon Juice",
    "Simple Syrup",
    "Triple Sec",
    "Cranberry Juice",
    "Orange Juice",
    "Pineapple Juice",
    "Ginger Beer",
    "Mint",
    "Basil",
    "Rosemary",
    "Angostura Bitters",
  ]

  const flavorProfiles = ["Sweet", "Sour", "Bitter", "Spicy", "Fruity", "Herbal", "Smoky", "Citrusy"]

  const savedRecipes = [
    {
      id: 1,
      name: "Sunset Serenity",
      rating: 5,
      ingredients: ["Tequila", "Pineapple Juice", "Lime", "Jalapeño"],
      difficulty: "Easy",
      time: "3 min",
    },
    {
      id: 2,
      name: "Garden Whisper",
      rating: 4,
      ingredients: ["Gin", "Cucumber", "Basil", "Lime"],
      difficulty: "Medium",
      time: "5 min",
    },
    {
      id: 3,
      name: "Midnight Velvet",
      rating: 5,
      ingredients: ["Bourbon", "Blackberry", "Lemon", "Thyme"],
      difficulty: "Hard",
      time: "8 min",
    },
  ]

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient],
    )
  }

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) => (prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]))
  }

  const NavigationBar = () => (
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
              className={`text-sm font-medium transition-colors ${currentView === "landing" ? "text-amber-600" : "text-gray-600 hover:text-amber-600"}`}
            >
              <Home className="h-4 w-4 inline mr-1" />
              Generate
            </button>
            <button
              onClick={() => setCurrentView("saved")}
              className={`text-sm font-medium transition-colors ${currentView === "saved" ? "text-amber-600" : "text-gray-600 hover:text-amber-600"}`}
            >
              <Heart className="h-4 w-4 inline mr-1" />
              Saved
            </button>
            <button
              onClick={() => setCurrentView("mybar")}
              className={`text-sm font-medium transition-colors ${currentView === "mybar" ? "text-amber-600" : "text-gray-600 hover:text-amber-600"}`}
            >
              <BookOpen className="h-4 w-4 inline mr-1" />
              My Bar
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className={`text-sm font-medium transition-colors ${currentView === "profile" ? "text-amber-600" : "text-gray-600 hover:text-amber-600"}`}
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

  const LandingView = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Craft Your Perfect
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent block">
              Cocktail Experience
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered cocktail recipes tailored to your taste, ingredients, and mood. Discover unique drinks you'll
            love.
          </p>
        </div>

        {/* Main Generation Form */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-amber-600" />
              Generate Your Cocktail
            </CardTitle>
            <CardDescription>Tell us what you have and what you're craving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Available Ingredients */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">What's in your bar?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {ingredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
                    className={`cursor-pointer p-2 text-center justify-center transition-all ${
                      selectedIngredients.includes(ingredient)
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "hover:bg-amber-50 hover:border-amber-300"
                    }`}
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Flavor Preferences */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Flavor vibes you're feeling</Label>
              <div className="flex flex-wrap gap-2">
                {flavorProfiles.map((flavor) => (
                  <Badge
                    key={flavor}
                    variant={selectedFlavors.includes(flavor) ? "default" : "outline"}
                    className={`cursor-pointer p-2 transition-all ${
                      selectedFlavors.includes(flavor)
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "hover:bg-orange-50 hover:border-orange-300"
                    }`}
                    onClick={() => toggleFlavor(flavor)}
                  >
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Options */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Strength</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="mocktail">Non-alcoholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Occasion</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Relaxing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="relaxing">Relaxing</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="date">Date Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Special requests or dietary restrictions</Label>
              <Textarea
                placeholder="e.g., No citrus, make it batch-friendly, surprise me with something unique..."
                className="resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={() => setCurrentView("recipe")}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white py-6 text-lg font-semibold"
            >
              <Zap className="h-5 w-5 mr-2" />
              Generate My Perfect Cocktail
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0">
            <ChefHat className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">10,000+</h3>
            <p className="text-gray-600">Unique recipes generated</p>
          </Card>
          <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">5,000+</h3>
            <p className="text-gray-600">Happy home bartenders</p>
          </Card>
          <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">4.9/5</h3>
            <p className="text-gray-600">Average recipe rating</p>
          </Card>
        </div>
      </div>
    </div>
  )

  const RecipeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentView("landing")} className="mb-4">
            ← Back to Generator
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-amber-600" />
              <Badge className="bg-green-100 text-green-800">Fresh Recipe</Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Sunset Serenity</CardTitle>
            <CardDescription className="text-lg">
              A vibrant tequila-based cocktail with tropical notes and a gentle spicy kick
            </CardDescription>

            {/* Recipe Meta */}
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />3 min prep
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                Easy
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />1 serving
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wine className="h-5 w-5 text-amber-600" />
                Ingredients
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span>Silver Tequila</span>
                  <span className="font-semibold">2 oz</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span>Fresh Pineapple Juice</span>
                  <span className="font-semibold">1 oz</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span>Fresh Lime Juice</span>
                  <span className="font-semibold">0.5 oz</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span>Agave Syrup</span>
                  <span className="font-semibold">0.25 oz</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span>Jalapeño Slice</span>
                  <span className="font-semibold">1 piece</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span>Tajín (rim)</span>
                  <span className="font-semibold">For garnish</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Instructions</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <p className="text-gray-700 pt-1">
                    Rim a rocks glass with Tajín by running a lime wedge around the edge and dipping in the spice blend.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <p className="text-gray-700 pt-1">
                    In a shaker, muddle the jalapeño slice gently to release oils without breaking it apart.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <p className="text-gray-700 pt-1">
                    Add tequila, pineapple juice, lime juice, and agave syrup to the shaker with ice.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <p className="text-gray-700 pt-1">
                    Shake vigorously for 15 seconds and double strain into the prepared glass over fresh ice.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                    5
                  </div>
                  <p className="text-gray-700 pt-1">
                    Garnish with a pineapple wedge and lime wheel. Serve immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Glassware & Garnish */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold mb-2">Recommended Glassware</h4>
                <p className="text-gray-700">Rocks glass (old fashioned)</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold mb-2">Perfect Garnish</h4>
                <p className="text-gray-700">Pineapple wedge & lime wheel</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button className="bg-red-500 hover:bg-red-600">
                <Heart className="h-4 w-4 mr-2" />
                Save Recipe
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Rate Recipe
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("landing")}>
                <Zap className="h-4 w-4 mr-2" />
                Generate Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const SavedRecipesView = () => (
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
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < recipe.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {recipe.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.time}
                  </span>
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
                  <Button size="sm" className="flex-1">
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

  const MyBarView = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bar Inventory</h1>
          <p className="text-gray-600">Manage your available ingredients for better recipe suggestions</p>
        </div>

        <Tabs defaultValue="spirits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="spirits">Spirits</TabsTrigger>
            <TabsTrigger value="mixers">Mixers</TabsTrigger>
            <TabsTrigger value="garnishes">Garnishes</TabsTrigger>
            <TabsTrigger value="tools">Bar Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="spirits">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wine className="h-5 w-5 text-amber-600" />
                  Spirits & Liqueurs
                </CardTitle>
                <CardDescription>Select the most popular spirits you have available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Vodka",
                    "Gin",
                    "White Rum",
                    "Dark Rum",
                    "Silver Tequila",
                    "Reposado Tequila",
                    "Bourbon",
                    "Rye Whiskey",
                    "Triple Sec",
                    "Dry Vermouth",
                    "Sweet Vermouth",
                    "Campari",
                  ].map((spirit) => (
                    <div key={spirit} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox id={spirit} defaultChecked={["Gin", "Silver Tequila", "Bourbon"].includes(spirit)} />
                        <label htmlFor={spirit} className="font-medium">
                          {spirit}
                        </label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Popular
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Other spirits you have (free form)</Label>
                  <Textarea
                    placeholder="List any other spirits, liqueurs, or specialty bottles you have... 
e.g., St-Germain, Aperol, Mezcal, Japanese Whisky, Chartreuse, etc."
                    className="resize-none min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mixers">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Mixers & Juices</CardTitle>
                <CardDescription>Your available mixers, juices, and syrups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Simple Syrup",
                    "Lime Juice",
                    "Lemon Juice",
                    "Orange Juice",
                    "Cranberry Juice",
                    "Ginger Beer",
                    "Tonic Water",
                    "Club Soda",
                  ].map((mixer) => (
                    <div key={mixer} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox id={mixer} defaultChecked={mixer.includes("Juice") || mixer === "Simple Syrup"} />
                        <label htmlFor={mixer} className="font-medium">
                          {mixer}
                        </label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Fresh
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Mixer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="garnishes">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Garnishes & Herbs</CardTitle>
                <CardDescription>Fresh herbs, fruits, and garnish ingredients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Fresh Mint",
                    "Fresh Basil",
                    "Lime Wedges",
                    "Lemon Wheels",
                    "Orange Peel",
                    "Maraschino Cherries",
                    "Olives",
                    "Salt (for rim)",
                  ].map((garnish) => (
                    <div key={garnish} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox id={garnish} defaultChecked={garnish.includes("Mint") || garnish.includes("Lime")} />
                        <label htmlFor={garnish} className="font-medium">
                          {garnish}
                        </label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Available
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Garnish
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Bar Tools & Equipment</CardTitle>
                <CardDescription>Essential tools for cocktail preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Cocktail Shaker",
                    "Jigger",
                    "Muddler",
                    "Strainer",
                    "Bar Spoon",
                    "Citrus Juicer",
                    "Ice Bucket",
                    "Mixing Glass",
                  ].map((tool) => (
                    <div key={tool} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox id={tool} defaultChecked={["Cocktail Shaker", "Jigger", "Strainer"].includes(tool)} />
                        <label htmlFor={tool} className="font-medium">
                          {tool}
                        </label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Have
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Tool
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-gradient-to-r from-amber-600 to-orange-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Inventory Complete!</h3>
            <p className="mb-4 opacity-90">
              Your bar setup looks great! Ready to generate cocktails with your available ingredients.
            </p>
            <Button onClick={() => setCurrentView("landing")} className="bg-white text-amber-600 hover:bg-gray-100">
              <Zap className="h-4 w-4 mr-2" />
              Generate Cocktail Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const ProfileView = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Preferences</h1>
          <p className="text-gray-600">Customize your cocktail generation experience</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm border-0">
            <CardHeader className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>Home Bartender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">47</div>
                <div className="text-sm text-gray-600">Recipes Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">12</div>
                <div className="text-sm text-gray-600">Favorites Saved</div>
              </div>
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Default Preferences</CardTitle>
                <CardDescription>Set your go-to preferences for faster cocktail generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Preferred Base Spirits</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Gin", "Tequila", "Whiskey", "Rum", "Vodka"].map((spirit) => (
                      <Badge
                        key={spirit}
                        variant={["Gin", "Tequila"].includes(spirit) ? "default" : "outline"}
                        className={`cursor-pointer p-2 ${
                          ["Gin", "Tequila"].includes(spirit) ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-50"
                        }`}
                      >
                        {spirit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Favorite Flavor Profiles</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Citrusy", "Herbal", "Fruity", "Spicy"].map((flavor) => (
                      <Badge
                        key={flavor}
                        variant={["Citrusy", "Herbal"].includes(flavor) ? "default" : "outline"}
                        className={`cursor-pointer p-2 ${
                          ["Citrusy", "Herbal"].includes(flavor)
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "hover:bg-orange-50"
                        }`}
                      >
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Default Strength</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="strong">Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Preferred Difficulty</Label>
                    <Select defaultValue="easy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Dietary Restrictions</CardTitle>
                <CardDescription>Help us avoid ingredients you can't or don't want to consume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { id: "gluten", label: "Gluten-free", checked: true },
                    { id: "dairy", label: "Dairy-free", checked: false },
                    { id: "vegan", label: "Vegan", checked: false },
                    { id: "nuts", label: "Nut allergies", checked: false },
                  ].map((restriction) => (
                    <div key={restriction.id} className="flex items-center space-x-2">
                      <Checkbox id={restriction.id} defaultChecked={restriction.checked} />
                      <Label htmlFor={restriction.id}>{restriction.label}</Label>
                    </div>
                  ))}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Additional restrictions or dislikes</Label>
                  <Textarea
                    placeholder="e.g., No cilantro, avoid overly sweet drinks, prefer natural ingredients..."
                    className="resize-none"
                    defaultValue="No cilantro please - it tastes like soap to me!"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1">Save Preferences</Button>
              <Button variant="outline">Reset to Defaults</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const views = {
    landing: <LandingView />,
    recipe: <RecipeView />,
    saved: <SavedRecipesView />,
    mybar: <MyBarView />,
    profile: <ProfileView />,
  }

  return <div className="min-h-screen">{views[currentView as keyof typeof views]}</div>
}
