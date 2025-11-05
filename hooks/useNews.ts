import { supabase } from '@/lib/supabase';
import { NewsArticle } from '@/types/news';
import { useEffect, useState } from 'react';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data) {
        const formatted = data.map((item) => ({
          id: item.id,
          headline: item.title,           // ✅ maps title -> headline
          description: item.content,      // ✅ maps content -> description
          category: item.category,
          source: 'Newsbite',             // or fetch via relations later
          publishedAt: item.published_at,
          imageUrl: item.image_url,
        }));

        setArticles(formatted);
      }

      setLoading(false);
    };

    fetchNews();
  }, []);

  return { articles, loading };
}
