/**
 * Script to seed the database with recent news articles
 * Run with: node scripts/seed-news.js
 * 
 * Make sure to set these environment variables:
 * EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
 * 
 * Or create a .env file with these values
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay - use environment variables directly
  console.log('ℹ️  dotenv not installed, that\'s okay - using environment variables directly', e);
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Try service role key first (for seeding), fall back to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials!');
  console.error('\nPlease set environment variables:');
  console.error('  EXPO_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('\nOr for seeding (bypasses RLS):');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('\n⚠️  If you get RLS policy errors, you need to either:');
  console.error('  1. Add an RLS policy (see scripts/fix-rls-policy.sql)');
  console.error('  2. Use service role key (never commit this to git!)');
  console.error('\nOr create a .env file with these values.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Warn if using service role key
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: Using service role key - this bypasses RLS policies!');
  console.warn('   Never commit this key to version control!\n');
}

// Generate recent dates - use TODAY or very recent dates to ensure visibility
const getRecentDate = (daysAgo) => {
  const date = new Date();
  // Use 0-2 days ago max to ensure articles are definitely recent
  const daysBack = Math.min(daysAgo, 2);
  date.setDate(date.getDate() - daysBack);
  // Set to a specific time to ensure consistency
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

// Sample news articles with recent dates
const recentNewsArticles = [
  {
    title: "AI Breakthrough: New Language Model Surpasses Human Performance in Coding Tasks",
    content: "A leading tech company has announced a revolutionary AI language model that has demonstrated superior performance in software development tasks. The model, trained on billions of lines of code, can now generate, debug, and optimize code with unprecedented accuracy. Industry experts predict this will transform software development workflows, potentially reducing development time by up to 50%. The technology is expected to be available to developers in the coming months, with early access programs already generating significant interest from major tech firms worldwide.",
    category: "Tech",
    image_url: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "TechNews Daily",
    published_at: getRecentDate(2),
    is_published: true,
  },
  {
    title: "Global Markets Rally as Central Banks Signal Rate Cuts",
    content: "Stock markets worldwide surged today following signals from major central banks indicating potential interest rate reductions in the coming months. The Dow Jones, S&P 500, and NASDAQ all posted significant gains, with technology and financial sectors leading the rally. Analysts attribute the positive sentiment to improved inflation data and stronger economic indicators. Investors are now closely watching upcoming policy meetings, with many expecting a shift toward more accommodative monetary policies that could stimulate further economic growth.",
    category: "Business",
    image_url: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Financial Times",
    published_at: getRecentDate(1),
    is_published: true,
  },
  {
    title: "Climate Summit Reaches Historic Agreement on Renewable Energy Targets",
    content: "World leaders at the International Climate Summit have reached a groundbreaking agreement to triple renewable energy capacity by 2030. The pact, signed by over 150 countries, commits to investing trillions in solar, wind, and hydroelectric infrastructure. Environmental groups have praised the initiative as a crucial step toward meeting global climate goals. The agreement also includes provisions for technology transfer to developing nations and establishes a new fund to support green energy transitions in emerging economies.",
    category: "Politics",
    image_url: "https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Global News Network",
    published_at: getRecentDate(3),
    is_published: true,
  },
  {
    title: "Olympic Committee Announces New Sports for 2028 Games",
    content: "The International Olympic Committee has revealed exciting additions to the 2028 Summer Olympics program. Breakdancing, skateboarding, and sport climbing will make their return, while flag football and lacrosse will debut as official Olympic sports. The announcement has generated enthusiasm among athletes and fans worldwide, with many praising the IOC's commitment to evolving with modern sports culture. Preparations are already underway in Los Angeles, the host city, with new venues being constructed to accommodate these dynamic sports.",
    category: "Sports",
    image_url: "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Sports Illustrated",
    published_at: getRecentDate(5),
    is_published: true,
  },
  {
    title: "Revolutionary Cancer Treatment Shows 90% Success Rate in Clinical Trials",
    content: "Medical researchers have announced breakthrough results from a new cancer treatment that has shown a remarkable 90% success rate in early clinical trials. The innovative therapy combines targeted gene editing with personalized immunotherapy, marking a significant advancement in oncology. Patients with previously untreatable cancers have shown complete remission after treatment. The research team is now seeking FDA approval for expanded trials, with hopes of making the treatment available to patients within the next two years.",
    category: "Health",
    image_url: "https://images.pexels.com/photos/3845555/pexels-photo-3845555.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Medical Journal",
    published_at: getRecentDate(4),
    is_published: true,
  },
  {
    title: "SpaceX Successfully Launches Mission to Mars with First Human Passengers",
    content: "In a historic moment for space exploration, SpaceX has successfully launched its first crewed mission to Mars. The spacecraft, carrying four astronauts, is expected to reach the Red Planet in approximately seven months. This mission represents a major milestone in humanity's quest to become a multi-planetary species. The crew will conduct extensive research on Mars' surface, testing life support systems and studying the planet's geology and potential for future colonization.",
    category: "Tech",
    image_url: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=800",
    source: "Space News",
    published_at: getRecentDate(6),
    is_published: true,
  },
  {
    title: "Major Tech Company Unveils Next-Generation Smartphone with Foldable Display",
    content: "A leading smartphone manufacturer has unveiled its latest flagship device featuring an innovative foldable display technology. The new phone can seamlessly transform from a compact device to a tablet-sized screen, offering users unprecedented flexibility. Early reviews praise the device's durability, display quality, and innovative software features designed specifically for the foldable form factor. Pre-orders have already exceeded expectations, with the company reporting record-breaking sales figures in the first 24 hours.",
    category: "Tech",
    image_url: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "TechReview",
    published_at: getRecentDate(7),
    is_published: true,
  },
  {
    title: "Renewable Energy Now Accounts for 50% of Global Electricity Generation",
    content: "A new report reveals that renewable energy sources have reached a historic milestone, now accounting for 50% of global electricity generation. Solar and wind power have led this transformation, with investments in clean energy infrastructure reaching record levels. This shift represents a major step toward achieving net-zero emissions goals. Energy experts predict that renewables could account for 75% of global power generation by 2030, driven by falling costs and improved technology efficiency.",
    category: "Business",
    image_url: "https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Energy Report",
    published_at: getRecentDate(8),
    is_published: true,
  },
  {
    title: "International Peace Summit Addresses Global Conflicts",
    content: "World leaders gathered at an unprecedented peace summit to address ongoing conflicts and tensions around the globe. The summit focused on diplomatic solutions, humanitarian aid, and establishing frameworks for conflict resolution. Key discussions centered on regions experiencing prolonged conflicts, with participating nations committing to increased dialogue and cooperation. The event concluded with a joint declaration emphasizing the importance of peaceful resolution and international cooperation in maintaining global stability.",
    category: "Politics",
    image_url: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "World News",
    published_at: getRecentDate(9),
    is_published: true,
  },
  {
    title: "Championship Finals Set New Viewership Records",
    content: "The world championship finals have broken all previous viewership records, with over 2 billion people tuning in globally. The thrilling match went into overtime, keeping audiences on the edge of their seats until the final moments. Social media platforms reported record engagement, with millions of posts and comments during the event. The championship has been praised for its high level of competition and sportsmanship, setting a new standard for international sporting events.",
    category: "Sports",
    image_url: "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Sports Network",
    published_at: getRecentDate(10),
    is_published: true,
  },
  {
    title: "Breakthrough in Quantum Computing Achieves New Milestone",
    content: "Scientists have achieved a major breakthrough in quantum computing, successfully demonstrating error correction that could make quantum computers practical for real-world applications. The research team managed to maintain quantum states for significantly longer periods, addressing one of the biggest challenges in quantum computing. This advancement could revolutionize fields such as cryptography, drug discovery, and complex problem-solving. Industry leaders are already exploring partnerships to commercialize this technology.",
    category: "Tech",
    image_url: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Science Daily",
    published_at: getRecentDate(11),
    is_published: true,
  },
  {
    title: "Global Economy Shows Strong Growth Indicators",
    content: "Economic indicators from around the world point to robust growth, with GDP figures exceeding expectations in major economies. Manufacturing output has increased, unemployment rates have dropped, and consumer confidence has reached multi-year highs. Central banks are monitoring inflation closely while maintaining policies that support continued expansion. Economists predict sustained growth through the next quarter, though they caution about potential challenges from supply chain disruptions and geopolitical tensions.",
    category: "Business",
    image_url: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Economic Times",
    published_at: getRecentDate(12),
    is_published: true,
  },
  {
    title: "New Education Initiative Aims to Bridge Digital Divide",
    content: "A comprehensive education initiative has been launched to provide digital literacy training and technology access to underserved communities worldwide. The program will distribute millions of devices, establish learning centers, and train educators in digital skills. The initiative has received support from governments, tech companies, and non-profit organizations. Organizers hope to reach 100 million students over the next five years, ensuring that no one is left behind in the digital age.",
    category: "India",
    image_url: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Education News",
    published_at: getRecentDate(13),
    is_published: true,
  },
  {
    title: "Major Breakthrough in Alzheimer's Research Offers Hope",
    content: "Researchers have identified a potential treatment pathway for Alzheimer's disease that has shown promising results in early-stage trials. The new approach targets specific proteins associated with the disease, potentially slowing or even reversing cognitive decline. Patients in the study showed significant improvements in memory and cognitive function. While more research is needed, this breakthrough offers hope to millions of families affected by Alzheimer's worldwide.",
    category: "Health",
    image_url: "https://images.pexels.com/photos/3845555/pexels-photo-3845555.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Health Journal",
    published_at: getRecentDate(14),
    is_published: true,
  },
  {
    title: "International Film Festival Celebrates Diverse Storytelling",
    content: "The prestigious international film festival concluded with awards recognizing outstanding achievements in cinema from around the world. This year's festival highlighted diverse voices and stories, with films from over 50 countries competing for top honors. The event attracted thousands of filmmakers, critics, and cinema enthusiasts, generating significant buzz for upcoming releases. Several award-winning films are already generating Oscar buzz, with industry insiders predicting strong performances during awards season.",
    category: "Entertainment",
    image_url: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800",
    source: "Entertainment Weekly",
    published_at: getRecentDate(15),
    is_published: true,
  },
];

async function seedNews() {
  console.log('🌱 Starting to seed news articles...\n');
  console.log(`📡 Connecting to Supabase: ${supabaseUrl.substring(0, 30)}...\n`);

  try {
    // Check if source column exists (optional - will default to 'Newsbite' if not available)
    console.log('🔍 Checking database schema...');
    let sourceColumnExists = false;
    const { error: schemaError } = await supabase
      .from('news')
      .select('source')
      .limit(1);

    if (!schemaError) {
      sourceColumnExists = true;
      console.log('✅ Source column found - will include source attribution\n');
    } else if (schemaError.message && schemaError.message.includes('column') && schemaError.message.includes('source')) {
      console.log('ℹ️  Source column not found - articles will default to "Newsbite" (this is okay)\n');
      sourceColumnExists = false;
    } else {
      // Other error, assume source column might exist
      sourceColumnExists = true;
      console.log('ℹ️  Could not verify source column - will attempt to include it\n');
    }

    // First, check if we need to get author_id
    let authorId = null;

    // Try to get the first user/author from the database
    // This is optional - only if your schema requires author_id
    try {
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (!userError && users && users.length > 0) {
        authorId = users[0].id;
        console.log('✅ Found author ID:', authorId);
      } else {
        console.log('ℹ️  No users table or no users found - will try without author_id');
      }
    } catch (e) {
      console.log('ℹ️  Could not fetch users (this is okay if author_id is not required)', e);
    }

    // Prepare articles for insertion
    // Include source field if column exists, otherwise app will default to 'Newsbite'
    const articlesToInsert = recentNewsArticles.map(article => {
      const baseArticle = {
        title: article.title,
        content: article.content,
        category: article.category,
        image_url: article.image_url,
        published_at: article.published_at,
        is_published: article.is_published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Only include source if the column exists in the database
      if (sourceColumnExists) {
        baseArticle.source = article.source;
      }
      // If source column doesn't exist, the app will default to 'Newsbite'

      // Only add author_id if we have one
      if (authorId) {
        baseArticle.author_id = authorId;
      }

      return baseArticle;
    });

    // Insert articles in batches
    const batchSize = 5;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < articlesToInsert.length; i += batchSize) {
      const batch = articlesToInsert.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('news')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);

        // Check for RLS policy error
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.error('\n   🔒 RLS POLICY ERROR DETECTED!');
          console.error('   Your database has Row Level Security enabled but no policy allows inserts.');
          console.error('   Solutions:');
          console.error('   1. Run the SQL script: scripts/fix-rls-policy.sql in Supabase SQL Editor');
          console.error('   2. Or use service role key: SUPABASE_SERVICE_ROLE_KEY=... npm run seed-news');
          console.error('   See scripts/README-RLS-FIX.md for details.\n');
        } else {
          console.error('   Full error:', JSON.stringify(error, null, 2));
        }

        // If error is about a missing column (like 'source'), try without it
        if (error.message && error.message.includes('column') && error.message.includes('source')) {
          console.log('   ⚠️  Source column not found - retrying without source field...');

          // Retry without source field
          const batchWithoutSource = batch.map(article => {
            const { source, ...articleWithoutSource } = article;
            return articleWithoutSource;
          });

          const { data: retryData, error: retryError } = await supabase
            .from('news')
            .insert(batchWithoutSource)
            .select();

          if (!retryError && retryData) {
            inserted += retryData.length;
            console.log(`   ✅ Retry successful: Inserted ${retryData.length} articles (will default to 'Newsbite')`);
            continue;
          } else {
            console.error('   ❌ Retry also failed:', retryError?.message);
            console.error('   Retry error details:', JSON.stringify(retryError, null, 2));
          }
        }

        errors++;
      } else {
        inserted += data.length;
        console.log(`✅ Inserted ${data.length} articles (${inserted}/${articlesToInsert.length} total)`);
        // Show sample of inserted articles
        if (data && data.length > 0) {
          console.log(`   Sample: "${data[0].title}" (Category: ${data[0].category}, Published: ${new Date(data[0].published_at).toLocaleDateString()})`);
        }
      }
    }

    console.log('\n✨ Seeding complete!');
    console.log(`✅ Successfully inserted: ${inserted} articles`);
    if (errors > 0) {
      console.log(`⚠️  Errors encountered: ${errors} batches`);
    }

    // Verify the inserted articles
    // Try to select source, but handle if column doesn't exist
    let selectFields = 'id, title, category, published_at';
    if (sourceColumnExists) {
      selectFields += ', source';
    }

    const { data: recentArticles, error: fetchError } = await supabase
      .from('news')
      .select(selectFields)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(5);

    if (!fetchError && recentArticles) {
      console.log('\n📰 Sample of recent articles:');
      recentArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        const sourceInfo = sourceColumnExists
          ? `Source: ${article.source || 'Newsbite (default)'}`
          : 'Source: Newsbite (default - column not in DB)';
        console.log(`   Category: ${article.category} | ${sourceInfo}`);
        console.log(`   Published: ${new Date(article.published_at).toLocaleDateString()}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedNews()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

