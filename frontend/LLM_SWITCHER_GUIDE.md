# LLM Switcher Guide

## Overview
The debug dialog now includes an LLM switcher that allows you to change which AI model is used when generating cocktail recipes via the `/api/cocktails/generate` endpoint.

## Features

### Available Models
- **GPT-4o Mini** (OpenAI) - Fast and efficient, good for most tasks *(default)*
- **Claude 3 Haiku** (Anthropic) - Fast and creative
- **Gemma 3 27B (Free)** (Google) - Free Google model, good performance
- **Gemini 2.5 Flash Preview** (Google) - Latest Gemini preview model
- **Gemini 2.5 Flash (Thinking)** (Google) - Gemini with enhanced reasoning
- **Llama 4 Scout (Free)** (Meta) - Latest Llama model, free tier

### How to Use

1. **Open Debug Dialog**: Click the purple bug icon (🐛) in the bottom-right corner (development mode only)

2. **Select Model**: Use the dropdown in the "LLM Model" section to choose your preferred AI model

3. **Generate Recipe**: The selected model will be used for all subsequent recipe generations

4. **Reset to Default**: Click the refresh icon to reset to the default model (GPT-4o Mini)

### Persistence
Your selected model preference is saved in localStorage and will persist across browser sessions.

### Logging
- Model changes are logged to the debug console
- Backend logs show which model is being used for each request
- Recipe generation includes model information in console output

## Technical Implementation

### Frontend Changes
- New `LLMSwitcher` component in `components/debug/llm-switcher.tsx`
- `useSelectedLLM` hook for accessing the current model selection
- Updated `DevLogger` to include the switcher
- Modified `RecipeGenerationButton` to include model in API requests

### Backend Changes
- Added optional `model` parameter to `UserPreferences` model
- Updated `CocktailRecipeService` to use the specified model
- Enhanced logging to show which model is being used

### API Changes
- `/api/cocktails/generate` now accepts an optional `model` parameter
- Example request:
```json
{
  "ingredients": ["vodka"],
  "flavors": ["sweet"],
  "vibe": "date night",
  "model": "anthropic/claude-3-haiku"
}
```

## OpenRouter Model Format
The following OpenRouter model identifiers are supported:
- `openai/gpt-4o-mini`
- `anthropic/claude-3-haiku`
- `google/gemma-3-27b-it:free`
- `google/gemini-2.5-flash-preview-05-20`
- `google/gemini-2.5-flash-preview-05-20:thinking`
- `meta-llama/llama-4-scout:free`

## Development Notes
- The LLM switcher only appears in development mode
- Model selection is validated against the available models list
- Fallback behavior remains unchanged if no model is specified
- All models use the same prompt structure and parameters
- Free tier models are marked accordingly 