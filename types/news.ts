export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  source?: string; // optional if you want
  headline?: string; // just map title -> headline
  description?: string; // map content or summary
}
