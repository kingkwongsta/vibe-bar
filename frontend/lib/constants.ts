export const INGREDIENTS = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Whiskey",
  "Bourbon",
  "Non-Alcoholic",
] as const

export const FLAVOR_PROFILES = [
  "Sweet",
  "Sour", 
  "Bitter",
  "Spicy",
  "Fruity",
  "Herbal",
  "Smoky",
  "Citrusy",
] as const

export const SPIRITS = [
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
] as const

export const MIXERS = [
  "Simple Syrup",
  "Lime Juice",
  "Lemon Juice",
  "Orange Juice",
  "Cranberry Juice",
  "Ginger Beer",
  "Tonic Water",
  "Club Soda",
] as const

export const GARNISHES = [
  "Fresh Mint",
  "Fresh Basil",
  "Lime Wedges",
  "Lemon Wheels",
  "Orange Peel",
  "Maraschino Cherries",
  "Olives",
  "Salt (for rim)",
] as const

export const BAR_TOOLS = [
  "Cocktail Shaker",
  "Jigger",
  "Muddler",
  "Strainer",
  "Bar Spoon",
  "Citrus Juicer",
  "Ice Bucket",
  "Mixing Glass",
] as const

// Categorized vibes for better variety
export const VIBE_CATEGORIES = {
  "Social & Events": [
    "Party",
    "Celebration", 
    "Girls Night",
    "Bachelor Party",
    "Business Meeting",
    "Family Gathering"
  ],
  "Intimate & Personal": [
    "Date Night",
    "Relaxing",
    "Cozy Evening",
    "Intimate",
    "Solo Treat",
    "Contemplative"
  ],
  "Activity & Time": [
    "Game Night",
    "Brunch Vibes",
    "Nightcap",
    "Pre-Dinner",
    "Work Happy Hour",
    "Late Night",
    "Sunday Afternoon",
    "Poolside"
  ],
  "Atmospheric & Mood": [
    "Summer Vibes",
    "Winter Warmth", 
    "Tropical Escape",
    "Vintage Classic",
    "Modern Sophisticated",
    "Adventurous",
    "Nostalgic",
    "Energizing",
    "Festive",
    "Spring Fresh",
    "Autumn Cozy"
  ]
} as const

// Flatten all vibes for backward compatibility
export const VIBES = Object.values(VIBE_CATEGORIES).flat()

// Random vibe generator function
export function generateRandomVibes(): string[] {
  const categories = Object.keys(VIBE_CATEGORIES) as Array<keyof typeof VIBE_CATEGORIES>
  const selectedVibes: string[] = []
  const maxPerCategory = 2
  const targetTotal = 8

  // First pass: randomly select up to 2 vibes from each category
  categories.forEach(category => {
    const categoryVibes = [...VIBE_CATEGORIES[category]]
    const shuffled = categoryVibes.sort(() => Math.random() - 0.5)
    const numToSelect = Math.min(maxPerCategory, shuffled.length)
    
    for (let i = 0; i < numToSelect && selectedVibes.length < targetTotal; i++) {
      selectedVibes.push(shuffled[i])
    }
  })

  // If we need more vibes to reach 8, randomly fill from remaining vibes
  if (selectedVibes.length < targetTotal) {
    const allVibes = Object.values(VIBE_CATEGORIES).flat()
    const remainingVibes = allVibes.filter(vibe => !selectedVibes.includes(vibe))
    const shuffledRemaining = remainingVibes.sort(() => Math.random() - 0.5)
    
    const needed = targetTotal - selectedVibes.length
    selectedVibes.push(...shuffledRemaining.slice(0, needed))
  }

  // Final shuffle and return exactly 8 vibes
  return selectedVibes.sort(() => Math.random() - 0.5).slice(0, targetTotal)
} 