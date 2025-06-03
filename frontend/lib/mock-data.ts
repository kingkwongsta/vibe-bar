import type { Recipe } from "./types"

export const SAVED_RECIPES: Recipe[] = [
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