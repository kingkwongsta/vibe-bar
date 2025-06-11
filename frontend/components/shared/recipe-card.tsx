import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  onViewRecipe?: () => void
}

export const RecipeCard = React.memo<RecipeCardProps>(function RecipeCard({ recipe, onViewRecipe }) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm border-0">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < recipe.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 text-xs text-gray-600">
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
          <Button size="sm" className="flex-1" onClick={onViewRecipe}>
            View Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}) 