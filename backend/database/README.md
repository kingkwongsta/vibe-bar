# Community Vibes Database Setup

This directory contains the database schema and setup instructions for the Community Vibes feature in Vibe Bar.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Your Supabase project URL and API keys

## Setup Instructions

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`) - Keep this secret!

### 2. Set Environment Variables

Create a `.env` file in the `backend` directory and add:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### 3. Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

### 4. Verify Setup

The schema will create:
- ✅ `community_vibes_recipes` table with all recipe data
- ✅ `recipe_ratings` table for user ratings and reviews
- ✅ Proper indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Sample test data

## Database Schema

### Tables Created

#### `community_vibes_recipes`
- Stores all Community Vibes recipes created by users
- Includes recipe data, creator info, community metrics, and AI metadata
- Supports ratings, views, favorites, and moderation features

#### `recipe_ratings`
- Stores user ratings and reviews for recipes
- Prevents duplicate ratings from the same email per recipe
- Automatically updates recipe rating statistics

### Key Features

- **UUID Primary Keys** - Using PostgreSQL UUID extension
- **Automatic Timestamps** - Created/updated timestamps with triggers
- **JSON Support** - Flexible storage for ingredients, metadata
- **Array Support** - PostgreSQL arrays for tags and instructions
- **Full-Text Search** - Indexed for fast recipe searching
- **Row Level Security** - Secure data access policies
- **Data Validation** - Check constraints for data integrity

## Testing

After running the schema, you should see:
1. A test recipe "Test Mojito Delight" in the recipes table
2. A test rating for that recipe
3. All tables and indexes created successfully

## Maintenance

- The `updated_at` column is automatically maintained by database triggers
- Rating statistics are updated when new ratings are added
- Use the provided indexes for optimal query performance

## Security Notes

- Row Level Security is enabled on all tables
- Public recipes are viewable by everyone
- Rating policies restrict access to public recipes only
- Service role key should only be used server-side (never in frontend)
- Consider implementing user authentication for enhanced security 