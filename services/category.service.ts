import { supabase } from '@/lib/supabase';
import { Category } from '@/types';

export const CategoryService = {
    async fetchCategories(): Promise<Category[]> {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('name')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error);
                throw error;
            }

            return data as Category[];
        } catch (error) {
            console.error('Unexpected error in fetchCategories:', error);
            return [];
        }
    },
};
