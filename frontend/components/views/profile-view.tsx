"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationBar } from "@/components/layout/navigation-bar"
import {
  Settings,
} from "lucide-react"
import type { ViewType } from "@/lib/types"

interface ProfileViewProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

export function ProfileView({ currentView, setCurrentView }: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <NavigationBar currentView={currentView} setCurrentView={setCurrentView} />

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

                <div className="grid md:grid-cols-1 gap-4">
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
} 