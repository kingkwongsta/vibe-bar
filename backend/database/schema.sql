-- Community Vibes Database Schema for Supabase
-- This file contains the SQL commands to create all necessary tables for Community Vibes recipes

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Community Vibes Recipes table
CREATE TABLE community_vibes_recipes (
    -- Primary key and timestamps
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Core recipe data
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ingredients JSONB NOT NULL,
    instructions TEXT[] NOT NULL,
    meta JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '[]'::jsonb,
    
    -- Creator information
    creator_name VARCHAR(50),
    creator_email VARCHAR(255),
    
    -- Recipe characteristics
    tags TEXT[] DEFAULT '{}',
    flavor_profile TEXT[] DEFAULT '{}',
    vibe VARCHAR(100),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard', 'Expert')),
    prep_time_minutes INTEGER CHECK (prep_time_minutes > 0 AND prep_time_minutes <= 1440),
    servings INTEGER CHECK (servings > 0 AND servings <= 20),
    
    -- AI generation metadata
    original_preferences JSONB,
    ai_model_used VARCHAR(100),
    
    -- Community metrics
    rating_average DECIMAL(3,2) CHECK (rating_average >= 0 AND rating_average <= 5),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
    favorite_count INTEGER DEFAULT 0 CHECK (favorite_count >= 0),
    
    -- Status and moderation
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE
);

-- Create Recipe Ratings table
CREATE TABLE recipe_ratings (
    -- Primary key and timestamps
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Rating data
    recipe_id UUID NOT NULL REFERENCES community_vibes_recipes(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    reviewer_name VARCHAR(50),
    reviewer_email VARCHAR(255),
    
    -- Prevent duplicate ratings from same email per recipe
    UNIQUE(recipe_id, reviewer_email)
);

-- Create indexes for performance
CREATE INDEX idx_community_vibes_recipes_created_at ON community_vibes_recipes(created_at DESC);
CREATE INDEX idx_community_vibes_recipes_name ON community_vibes_recipes(name);
CREATE INDEX idx_community_vibes_recipes_creator_email ON community_vibes_recipes(creator_email);
CREATE INDEX idx_community_vibes_recipes_difficulty ON community_vibes_recipes(difficulty_level);
CREATE INDEX idx_community_vibes_recipes_rating ON community_vibes_recipes(rating_average DESC);
CREATE INDEX idx_community_vibes_recipes_public ON community_vibes_recipes(is_public, is_approved);
CREATE INDEX idx_community_vibes_recipes_featured ON community_vibes_recipes(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_community_vibes_recipes_tags ON community_vibes_recipes USING GIN(tags);
CREATE INDEX idx_community_vibes_recipes_flavor_profile ON community_vibes_recipes USING GIN(flavor_profile);
CREATE INDEX idx_community_vibes_recipes_vibe ON community_vibes_recipes(vibe);

CREATE INDEX idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
CREATE INDEX idx_recipe_ratings_created_at ON recipe_ratings(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_community_vibes_recipes_updated_at 
    BEFORE UPDATE ON community_vibes_recipes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create Row Level Security (RLS) policies
ALTER TABLE community_vibes_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public and approved recipes
CREATE POLICY "Public recipes are viewable by everyone" 
    ON community_vibes_recipes FOR SELECT 
    USING (is_public = TRUE AND is_approved = TRUE);

-- Policy: Anyone can insert new recipes (for now, can be restricted later)
CREATE POLICY "Anyone can create recipes" 
    ON community_vibes_recipes FOR INSERT 
    WITH CHECK (TRUE);

-- Policy: Creators can update their own recipes (basic version)
CREATE POLICY "Creators can update their recipes" 
    ON community_vibes_recipes FOR UPDATE 
    USING (TRUE); -- Can be refined later with auth

-- Policy: Anyone can read ratings for public recipes
CREATE POLICY "Ratings are viewable for public recipes" 
    ON recipe_ratings FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM community_vibes_recipes 
            WHERE id = recipe_ratings.recipe_id 
            AND is_public = TRUE 
            AND is_approved = TRUE
        )
    );

-- Policy: Anyone can insert ratings (can be restricted later)
CREATE POLICY "Anyone can create ratings" 
    ON recipe_ratings FOR INSERT 
    WITH CHECK (TRUE);

-- Create some sample test data
INSERT INTO community_vibes_recipes (
    name, 
    description, 
    ingredients, 
    instructions, 
    creator_name, 
    tags, 
    flavor_profile, 
    vibe, 
    difficulty_level, 
    prep_time_minutes, 
    servings
) VALUES (
    'Test Mojito Delight',
    'A refreshing mojito with a unique twist perfect for summer vibes',
    '[
        {"name": "White Rum", "amount": "2 oz"},
        {"name": "Fresh Mint Leaves", "amount": "10 leaves"},
        {"name": "Lime Juice", "amount": "1 oz"},
        {"name": "Simple Syrup", "amount": "0.5 oz"},
        {"name": "Soda Water", "amount": "4 oz"}
    ]'::jsonb,
    ARRAY[
        'Muddle mint leaves in glass',
        'Add rum and lime juice',
        'Fill with ice',
        'Top with soda water',
        'Garnish with mint sprig'
    ],
    'Test Creator',
    ARRAY['refreshing', 'minty', 'summer'],
    ARRAY['fresh', 'citrus', 'herbal'],
    'Tropical Paradise',
    'Easy',
    5,
    1
);

-- Create a test rating for the sample recipe
INSERT INTO recipe_ratings (
    recipe_id,
    rating,
    review,
    reviewer_name,
    reviewer_email
) VALUES (
    (SELECT id FROM community_vibes_recipes WHERE name = 'Test Mojito Delight' LIMIT 1),
    5,
    'Amazing recipe! Perfect for summer parties.',
    'Test Reviewer',
    'test@example.com'
);

-- Update the recipe rating stats
UPDATE community_vibes_recipes 
SET rating_average = 5.0, rating_count = 1 
WHERE name = 'Test Mojito Delight'; 