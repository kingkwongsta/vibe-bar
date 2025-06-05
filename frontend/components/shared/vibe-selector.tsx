"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { VIBES } from "@/lib/constants"
import { useVibeBarContext } from "@/app/context/vibe-bar-context"

export function VibeSelector() {
  const {
    selectedVibe,
    setVibe,
  } = useVibeBarContext()

  return (
    <div>
      <Label className="text-lg font-semibold mb-4 block">Vibe</Label>
      <div className="flex flex-wrap gap-4">
        {VIBES.map((vibe) => (
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