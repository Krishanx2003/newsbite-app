import { supabase } from '@/lib/supabase';
import { NewsItem } from '@/types';

export const NewsService = {
    async fetchNews(category: string): Promise<NewsItem[]> {
        try {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            const threeMonthsAgoISO = threeMonthsAgo.toISOString();

            let query = supabase
                .from('news')
                .select('*')
                .eq('is_published', true)
                .gte('published_at', threeMonthsAgoISO)
                .order('published_at', { ascending: false });

            if (category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching news:', error);
                throw error;
            }

            return data as NewsItem[];
        } catch (error) {
            console.error('Unexpected error in fetchNews:', error);
            return [];
        }
    },
};
