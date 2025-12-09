# Seeding News Articles

This script helps you populate your Supabase database with recent news articles for testing and Google Play review.

## Prerequisites

1. Make sure you have your Supabase credentials set up

2. Your database should have a `news` table with the following **required** fields:
   - `id` (UUID, auto-generated)
   - `title` (text)
   - `content` (text)
   - `category` (text)
   - `image_url` (text, nullable)
   - `published_at` (timestamp)
   - `is_published` (boolean)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - `author_id` (UUID, nullable) - Only if your schema requires it

3. **Optional but Recommended**: Add the `source` column for better Google Play compliance:
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   ALTER TABLE news ADD COLUMN IF NOT EXISTS source TEXT;
   ```
   
   Or use the provided SQL script: `scripts/add-source-column.sql`
   
   **Note**: If the `source` column doesn't exist, the script will work fine and the app will default to "Newsbite" as the source. However, having the `source` column allows you to show specific publishers for each article, which is better for Google Play News policy compliance.

## How to Run

### Option 1: Using npm script (Recommended)

```bash
npm run seed-news
```

Make sure your `.env` file or environment variables contain:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Option 2: Direct command with environment variables

```bash
EXPO_PUBLIC_SUPABASE_URL=your_url EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key node scripts/seed-news.js
```

### Option 3: Using .env file

1. Create a `.env` file in the root directory (if it doesn't exist)
2. Add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run: `node scripts/seed-news.js`

## What the Script Does

- Inserts 15 recent news articles across multiple categories:
  - Technology (4 articles)
  - Business (3 articles)
  - Politics (2 articles)
  - Sports (2 articles)
  - Health (2 articles)
  - Education (1 article)
  - Entertainment (1 article)

- All articles have:
  - Recent publication dates (within last 15 days)
  - Proper source attribution
  - High-quality images
  - Complete content
  - Published status set to `true`

- Articles are distributed across different dates to show variety

## Notes

- The script will not duplicate articles if run multiple times (you may need to delete existing articles first)
- All articles are set with `is_published: true`
- Publication dates are set to recent dates (within last 15 days) to comply with Google Play's 3-month requirement
- If your schema requires `author_id`, the script will try to use the first user from your `users` table, or you may need to modify the script

## Troubleshooting

**Error: Missing Supabase credentials**
- Make sure your environment variables are set correctly
- Check that your `.env` file is in the root directory

**Error: Permission denied or RLS policy**
- Make sure your Supabase anon key has INSERT permissions on the `news` table
- Check your Row Level Security (RLS) policies in Supabase

**Error: Column 'author_id' is required**
- If your schema requires `author_id`, you may need to:
  1. Create a user in your `users` table first, or
  2. Modify the script to use a specific author_id, or
  3. Make `author_id` nullable in your database schema

## After Seeding

1. Verify articles in your Supabase dashboard
2. Test the app to ensure articles appear correctly
3. Check that dates are showing properly
4. Verify that the 3-month filter is working (only showing recent articles)

