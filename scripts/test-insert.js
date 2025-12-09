/**
 * Simple test script to insert ONE article and verify it works
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('🧪 Testing article insertion...\n');

  // Create a test article with TODAY's date
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  
  const testArticle = {
    title: "Test Article - " + new Date().toLocaleString(),
    content: "This is a test article to verify that article insertion is working correctly. If you can see this article in the app, then the seeding process should work.",
    category: "Tech",
    image_url: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    published_at: today.toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('📝 Test article data:');
  console.log(JSON.stringify(testArticle, null, 2));
  console.log('\n');

  try {
    // Try inserting with source first
    const testArticleWithSource = {
      ...testArticle,
      source: "Test Source"
    };

    console.log('🔄 Attempting to insert with source field...');
    const { data: data1, error: error1 } = await supabase
      .from('news')
      .insert(testArticleWithSource)
      .select();

    if (error1) {
      console.log('   ❌ Failed with source:', error1.message);
      
      if (error1.message && error1.message.includes('source')) {
        console.log('   🔄 Retrying without source field...');
        const { data: data2, error: error2 } = await supabase
          .from('news')
          .insert(testArticle)
          .select();

        if (error2) {
          console.error('   ❌ Failed without source:', error2.message);
          console.error('   Full error:', JSON.stringify(error2, null, 2));
          return;
        } else {
          console.log('   ✅ Success! Article inserted without source field');
          console.log('   Article ID:', data2[0].id);
          console.log('   Title:', data2[0].title);
          console.log('   Published:', new Date(data2[0].published_at).toLocaleString());
        }
      } else {
        console.error('   ❌ Unexpected error:', error1.message);
        console.error('   Full error:', JSON.stringify(error1, null, 2));
        return;
      }
    } else {
      console.log('   ✅ Success! Article inserted with source field');
      console.log('   Article ID:', data1[0].id);
      console.log('   Title:', data1[0].title);
      console.log('   Published:', new Date(data1[0].published_at).toLocaleString());
    }

    // Verify it can be retrieved
    console.log('\n🔍 Verifying article can be retrieved...');
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const { data: recent, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .gte('published_at', threeMonthsAgo.toISOString())
      .order('published_at', { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error('   ❌ Error fetching:', fetchError.message);
    } else {
      console.log(`   ✅ Found ${recent?.length || 0} recent articles`);
      if (recent && recent.length > 0) {
        console.log('   Recent articles:');
        recent.forEach((article, i) => {
          console.log(`   ${i + 1}. ${article.title} (${article.category}) - ${new Date(article.published_at).toLocaleDateString()}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

testInsert()
  .then(() => {
    console.log('\n✨ Test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });

