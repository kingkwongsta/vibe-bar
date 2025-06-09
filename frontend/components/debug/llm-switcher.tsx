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
    provider: "OpenAI"
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic"
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B (Free)",
    provider: "Google"
  },
  {
    id: "google/gemini-2.5-flash-preview-05-20",
    name: "Gemini 2.5 Flash Preview",
    provider: "Google"
  },
  {
    id: "google/gemini-2.5-flash-preview-05-20:thinking",
    name: "Gemini 2.5 Flash (Thinking)",
    provider: "Google"
  },
  {
    id: "meta-llama/llama-4-scout:free",
    name: "Llama 4 Scout (Free)",
    provider: "Meta"
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
              <div className="flex items-center gap-2">
                <span className="font-medium">{model.name}</span>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {model.provider}
                </Badge>
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