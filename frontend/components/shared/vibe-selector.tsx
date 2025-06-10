"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import { generateRandomVibes } from "@/lib/constants"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"

export function VibeSelector() {
  const {
    selectedVibe,
    setVibe,
  } = useVibeBarContext()

  const [displayedVibes, setDisplayedVibes] = useState<string[]>([])

  // Initialize with random vibes on component mount
  useEffect(() => {
    setDisplayedVibes(generateRandomVibes())
  }, [])

  const handleRandomize = () => {
    const newVibes = generateRandomVibes()
    setDisplayedVibes(newVibes)
    // If the currently selected vibe is not in the new random set, clear the selection
    if (selectedVibe && !newVibes.includes(selectedVibe)) {
      setVibe("")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Label className="text-lg font-bold text-orange-400">Vibe</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRandomize}
          className="flex items-center gap-2 text-md bg-orange-200 hover:bg-orange-200 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-800 transition-all duration-200"
        >
          <Shuffle className="h-4 w-4" />
          Randomize
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {displayedVibes.map((vibe) => (
          <Badge
            key={vibe}
            variant={selectedVibe === vibe ? "default" : "outline"}
            className={`cursor-pointer p-2 transition-all ${
              selectedVibe === vibe
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "hover:bg-indigo-50 hover:border-indigo-300"
            }`}
            onClick={() => setVibe(vibe)}
          >
            {vibe}
          </Badge>
        ))}
      </div>
    </div>
  )
} 