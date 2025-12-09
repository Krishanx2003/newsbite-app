-- SQL script to add the 'source' column to the news table
-- Run this in your Supabase SQL Editor

-- Add the source column if it doesn't exist
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS source TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN news.source IS 'Publisher or source of the news article (required for Google Play News policy compliance)';

-- Optional: Set a default value for existing rows
UPDATE news 
SET source = 'Newsbite' 
WHERE source IS NULL;

-- Optional: Make it NOT NULL if you want to enforce it (uncomment if desired)
-- ALTER TABLE news ALTER COLUMN source SET NOT NULL;
-- ALTER TABLE news ALTER COLUMN source SET DEFAULT 'Newsbite';

