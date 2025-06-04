# Logging Guide for Vibe Bar

## Overview
This app now includes comprehensive logging for user preference selections. Logs appear in both the Chrome DevTools console and can be viewed through an in-app debug panel.

## What Gets Logged

### User Preference Selections
- **Ingredient Selection/Deselection**: When users click on ingredient badges
- **Flavor Profile Changes**: When users select/deselect flavor preferences  
- **Custom Ingredient Management**: Adding or removing custom ingredients
- **Alcohol Strength Selection**: When users choose alcohol strength preferences
- **Vibe Selection**: When users select mood/vibe preferences
- **Navigation**: Moving between different app views
- **Form Actions**: When form data is collected or reset

### Log Format
Each log entry includes:
- **Timestamp**: When the action occurred
- **Category**: Type of action (user-action, navigation, etc.)
- **Action**: Specific action taken
- **Data**: Detailed information about the action
- **Session ID**: Unique identifier for the user session

## Viewing Logs

### Chrome DevTools Console
1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Go to the Console tab
3. Look for logs with emojis:
   - 📋 Info logs (user actions)
   - 🔍 Debug logs
   - ⚠️ Warning logs
   - ❌ Error logs

Example console output:
```
📋 [user-action] preference-select {"preferenceType":"ingredient","value":"vodka","operation":"select","timestamp":1699123456789}
📊 Full log details for: preference-select
```

### In-App Debug Panel (Development Only)
- Look for a purple bug icon (🐛) in the bottom-right corner
- Click it to open the debug panel
- View recent logs in a formatted, scrollable list
- Use "Clear" button to reset logs

## Manual Logging from Console

You can trigger manual logs from the browser console:

```javascript
// Access the logger globally (only in development)
logger.debug("Testing manual log", { customData: "test" })

// Log a custom user action
logger.logUserAction("custom-test", { testData: "example" })

// Log a preference selection
logger.logPreferenceSelection("test-preference", "test-value", "select")

// Get current session info
logger.getSessionInfo()
```

## Example Log Entries

### Ingredient Selection
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "category": "user-action", 
  "action": "preference-select",
  "data": {
    "preferenceType": "ingredient",
    "value": "gin",
    "operation": "select",
    "timestamp": 1705314645123
  },
  "sessionId": "abc123def456"
}
```

### Navigation
```json
{
  "timestamp": "2024-01-15T10:31:02.456Z",
  "level": "info",
  "category": "user-action",
  "action": "navigation", 
  "data": {
    "from": "landing",
    "to": "recipe",
    "timestamp": 1705314662456
  },
  "sessionId": "abc123def456"
}
```

### Form Data Collection
```json
{
  "timestamp": "2024-01-15T10:32:15.789Z",
  "level": "info", 
  "category": "user-action",
  "action": "form-data-collected",
  "data": {
    "totalIngredients": 3,
    "totalFlavors": 2,
    "customIngredients": 1,
    "alcoholStrength": "Medium",
    "vibe": "Cozy"
  },
  "sessionId": "abc123def456"
}
```

## Development vs Production

- **Development**: All logs appear in console + debug panel
- **Production**: Logging is disabled by default (can be extended to send to analytics services)

## Extending the Logger

To add logging to new components:

```typescript
import { logger } from '@/lib/logger'

// In your component
const handleCustomAction = () => {
  logger.logUserAction('custom-action', { 
    additionalData: 'example' 
  })
}
```

## Troubleshooting

- If logs don't appear: Check that you're in development mode (`npm run dev`)
- Console logs missing: Open Chrome DevTools Console tab
- Debug panel not showing: Look for the purple bug icon in bottom-right corner
- Session tracking: Each browser session gets a unique session ID 