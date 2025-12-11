export interface NewsItem {
    id: string;
    title: string;
    content: string;
    category: string;
    published_at: string;
    image_url: string | null;
    source?: string;
}

export interface UserProfile {
    name: string;
    bio: string;
    avatar: string | null;
}

export interface Category {
    id?: string;
    name: string;
    created_at?: string;
}
