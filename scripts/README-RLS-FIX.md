# Fixing Row Level Security (RLS) Policy Issue

## The Problem

You're getting this error:
```
new row violates row-level security policy for table "news"
```

This means your Supabase database has Row Level Security (RLS) enabled on the `news` table, but there's no policy that allows the anonymous key to insert rows.

## Solution Options

### Option 1: Add RLS Policy (Recommended for Production)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the SQL script: `scripts/fix-rls-policy.sql`

This will create a policy that allows anonymous users to insert articles.

### Option 2: Use Service Role Key (For Seeding Only)

If you want to keep RLS strict but allow seeding scripts to work:

1. Get your **Service Role Key** from Supabase Dashboard:
   - Go to **Settings** → **API**
   - Copy the **service_role** key (NOT the anon key)

2. Update your seed script to use the service role key:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/seed-news.js
   ```

   **⚠️ WARNING**: Never commit the service role key to git! It bypasses all RLS policies.

### Option 3: Temporarily Disable RLS (Not Recommended)

Only for testing/development:

```sql
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
```

Then re-enable it after seeding:
```sql
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
```

## Recommended Approach

For your use case (seeding articles for Google Play review), I recommend **Option 1** - adding an RLS policy that allows anonymous inserts. This is safe because:

1. The anon key is already public (it's in your app)
2. You can add additional checks in the policy (e.g., only allow inserts with `is_published = true`)
3. You can restrict it further later if needed

## After Fixing RLS

Once you've added the RLS policy, run the seed script again:

```bash
npm run seed-news
```

The articles should insert successfully!

