-- SQL script to fix RLS policies for news table
-- Run this in your Supabase SQL Editor

-- Option 1: Allow anonymous users to INSERT (for seeding)
-- This allows anyone with the anon key to insert articles
CREATE POLICY "Allow anonymous insert on news"
ON news
FOR INSERT
TO anon
WITH CHECK (true);

-- Option 2: If you want more control, you can restrict it to authenticated users only
-- Uncomment this instead if you prefer:
-- CREATE POLICY "Allow authenticated insert on news"
-- ON news
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- Option 3: If you want to allow inserts only for specific conditions
-- For example, only allow inserts if is_published is true:
-- CREATE POLICY "Allow insert published news"
-- ON news
-- FOR INSERT
-- TO anon
-- WITH CHECK (is_published = true);

-- Note: You may also need to allow SELECT for anonymous users if not already set
-- CREATE POLICY "Allow anonymous select on news"
-- ON news
-- FOR SELECT
-- TO anon
-- USING (true);

