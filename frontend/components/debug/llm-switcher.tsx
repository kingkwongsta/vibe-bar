"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Cpu, RefreshCw } from "lucide-react"

// Available LLM models
const AVAILABLE_MODELS = [
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast and efficient, good for most tasks"
  },
  {
    id: "openai/gpt-3.5-turbo", 
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Classic and reliable"
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic", 
    description: "Fast and creative"
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct",
    name: "Llama 3.2 3B",
    provider: "Meta",
    description: "Open source option"
  },
  {
    id: "google/gemini-flash-1.5",
    name: "Gemini Flash 1.5",
    provider: "Google",
    description: "Google's efficient model"
  }
]

const DEFAULT_MODEL = "openai/gpt-4o-mini"
const STORAGE_KEY = "vibe-bar-selected-llm"

interface LLMSwitcherProps {
  onModelChange?: (modelId: string) => void
}

export function LLMSwitcher({ onModelChange }: LLMSwitcherProps) {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)
  const [isChanging, setIsChanging] = useState(false)

  // Load saved model preference on mount
  useEffect(() => {
    const savedModel = localStorage.getItem(STORAGE_KEY)
    if (savedModel && AVAILABLE_MODELS.find(m => m.id === savedModel)) {
      setSelectedModel(savedModel)
    }
  }, [])

  const handleModelChange = async (modelId: string) => {
    setIsChanging(true)
    
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, modelId)
      setSelectedModel(modelId)
      
      // Notify parent component
      if (onModelChange) {
        onModelChange(modelId)
      }
      
      console.log(`🤖 LLM model switched to: ${modelId}`)
    } catch (error) {
      console.error('Failed to switch LLM model:', error)
    } finally {
      // Add a small delay for visual feedback
      setTimeout(() => setIsChanging(false), 300)
    }
  }

  const resetToDefault = () => {
    handleModelChange(DEFAULT_MODEL)
  }

  const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-3 w-3" />
          <span className="text-xs font-medium">LLM Model</span>
        </div>
        <Button
          onClick={resetToDefault}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
          title="Reset to default model"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      
      <Select value={selectedModel} onValueChange={handleModelChange} disabled={isChanging}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select LLM model" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {model.provider}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {currentModel && (
        <div className="text-xs text-gray-500">
          Current: <span className="font-medium">{currentModel.name}</span>
          {isChanging && <span className="ml-2">🔄 Switching...</span>}
        </div>
      )}
    </div>
  )
}

// Hook to get the currently selected LLM model
export function useSelectedLLM() {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)

  useEffect(() => {
    const savedModel = localStorage.getItem(STORAGE_KEY)
    if (savedModel && AVAILABLE_MODELS.find(m => m.id === savedModel)) {
      setSelectedModel(savedModel)
    }
  }, [])

  return selectedModel
} 