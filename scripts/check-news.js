/**
 * Diagnostic script to check news articles in the database
 * Run with: node scripts/check-news.js
 */

// Try to load dotenv if available
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not installed, that's okay
    console.log('ℹ️  dotenv not installed, that\'s okay - using environment variables directly', e);
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials!');
    console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNews() {
    console.log('🔍 Checking news articles in database...\n');

    try {
        // Calculate date 3 months ago (same as app does)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const threeMonthsAgoISO = threeMonthsAgo.toISOString();

        console.log(`📅 Filter date (3 months ago): ${threeMonthsAgoISO}\n`);

        // Check all articles
        const { data: allArticles, error: allError } = await supabase
            .from('news')
            .select('id, title, category, published_at, is_published, created_at')
            .order('created_at', { ascending: false });

        if (allError) {
            console.error('❌ Error fetching all articles:', allError.message);
            return;
        }

        console.log(`📊 Total articles in database: ${allArticles?.length || 0}\n`);

        if (allArticles && allArticles.length > 0) {
            console.log('📰 All Articles:');
            allArticles.forEach((article, index) => {
                const publishedDate = article.published_at ? new Date(article.published_at) : null;
                const isRecent = publishedDate && publishedDate >= new Date(threeMonthsAgoISO);
                const status = article.is_published ? '✅ Published' : '❌ Not Published';
                const dateStatus = isRecent ? '✅ Recent' : '⚠️  Too Old';

                console.log(`\n${index + 1}. ${article.title}`);
                console.log(`   Status: ${status}`);
                console.log(`   Category: ${article.category || 'N/A'}`);
                console.log(`   Published At: ${publishedDate ? publishedDate.toISOString() : 'N/A'}`);
                console.log(`   Date Check: ${dateStatus} (needs to be >= ${threeMonthsAgoISO})`);
                console.log(`   Created At: ${new Date(article.created_at).toISOString()}`);
            });
        }

        // Check published articles
        const { data: publishedArticles, error: publishedError } = await supabase
            .from('news')
            .select('id, title, category, published_at, is_published')
            .eq('is_published', true)
            .order('published_at', { ascending: false });

        console.log(`\n\n✅ Published articles: ${publishedArticles?.length || 0}`);

        // Check recent published articles (what app should show)
        const { data: recentPublished, error: recentError } = await supabase
            .from('news')
            .select('id, title, category, published_at, is_published')
            .eq('is_published', true)
            .gte('published_at', threeMonthsAgoISO)
            .order('published_at', { ascending: false });

        console.log(`\n✅ Recent published articles (last 3 months): ${recentPublished?.length || 0}`);

        if (recentPublished && recentPublished.length > 0) {
            console.log('\n📰 Articles that should appear in app:');
            recentPublished.forEach((article, index) => {
                console.log(`\n${index + 1}. ${article.title}`);
                console.log(`   Category: ${article.category || 'N/A'}`);
                console.log(`   Published: ${new Date(article.published_at).toLocaleDateString()}`);
            });
        } else {
            console.log('\n⚠️  No articles match the app\'s filter criteria!');
            console.log('   This means articles are either:');
            console.log('   - Not published (is_published = false)');
            console.log('   - Too old (published_at < 3 months ago)');
            console.log('   - Missing published_at date');
        }

        // Check categories
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('name')
            .order('name', { ascending: true });

        if (!categoriesError && categories) {
            console.log(`\n\n📂 Categories in database: ${categories.length}`);
            if (categories.length > 0) {
                console.log('   Categories:', categories.map(c => c.name).join(', '));
            }
        }

        // Check category matching
        if (recentPublished && categories) {
            const articleCategories = [...new Set(recentPublished.map(a => a.category).filter(Boolean))];
            const dbCategories = categories.map(c => c.name);

            console.log(`\n\n🔍 Category Matching Check:`);
            console.log(`   Article categories: ${articleCategories.join(', ') || 'None'}`);
            console.log(`   Database categories: ${dbCategories.join(', ') || 'None'}`);

            const mismatches = articleCategories.filter(ac => !dbCategories.includes(ac));
            if (mismatches.length > 0) {
                console.log(`\n   ⚠️  WARNING: Some article categories don't match database categories:`);
                console.log(`   ${mismatches.join(', ')}`);
                console.log(`   These articles won't show in category-specific views!`);
            }
        }

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

checkNews()
    .then(() => {
        console.log('\n\n✨ Check complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Check failed:', error);
        process.exit(1);
    });

