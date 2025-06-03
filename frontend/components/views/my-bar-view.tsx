"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/layout/navigation-bar"
import {
  Wine,
  Plus,
  Zap,
} from "lucide-react"
import type { ViewType } from "@/lib/types"

interface MyBarViewProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

export function MyBarView({ currentView, setCurrentView }: MyBarViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar currentView={currentView} setCurrentView={setCurrentView} />

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
} 