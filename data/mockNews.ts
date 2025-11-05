export interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  category: 'topstories' | 'trending' | 'technology' | 'sports';
  source: string;
}

export const mockNewsData: NewsArticle[] = [
  // Top Stories
  {
    id: '1',
    headline: 'Global Climate Summit Reaches Breakthrough Agreement',
    description: 'U.S. President Donald Trump reiterated concerns about India purchasing oil from Russia, following his announcement of a 25% tariff on Indian imports. This has sparked discussions on the impact of trade policies on global economies.',
    imageUrl: 'https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T10:30:00Z',
    category: 'topstories',
    source: 'Global News',
  },
  {
    id: '2',
    headline: 'Revolutionary Medical Breakthrough in Cancer Treatment',
    description: 'Scientists develop new immunotherapy that shows 95% success rate in early trials for multiple cancer types.',
    imageUrl: 'https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T09:15:00Z',
    category: 'topstories',
    source: 'Medical Tribune',
  },
  {
    id: '3',
    headline: 'Space Station Mission Launches Successfully',
    description: 'International crew begins six-month mission to conduct groundbreaking research in zero gravity.',
    imageUrl: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T08:45:00Z',
    category: 'topstories',
    source: 'Space Daily',
  },
  
  // Trending
  {
    id: '4',
    headline: 'Social Media Platform Introduces Revolutionary Privacy Features',
    description: 'New end-to-end encryption and data ownership controls give users unprecedented control over their digital footprint.',
    imageUrl: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T11:20:00Z',
    category: 'trending',
    source: 'Tech Insider',
  },
  {
    id: '5',
    headline: 'Viral Dance Challenge Raises Millions for Charity',
    description: 'Global movement started by teenagers has now raised over $50 million for children\'s education worldwide.',
    imageUrl: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T10:00:00Z',
    category: 'trending',
    source: 'Social Impact',
  },
  
  // Technology
  {
    id: '6',
    headline: 'AI Assistant Breakthrough: Understanding Context Like Humans',
    description: 'New language model demonstrates unprecedented ability to maintain context across complex conversations and tasks.',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T12:30:00Z',
    category: 'technology',
    source: 'AI Weekly',
  },
  {
    id: '7',
    headline: 'Quantum Computing Milestone: 1000-Qubit Processor Unveiled',
    description: 'Tech giant announces quantum processor capable of solving complex problems in minutes instead of years.',
    imageUrl: 'https://images.pexels.com/photos/2148222/pexels-photo-2148222.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T11:45:00Z',
    category: 'technology',
    source: 'Quantum Today',
  },
  {
    id: '8',
    headline: 'Electric Vehicle Sales Surge 300% Globally',
    description: 'Record-breaking year for EV adoption as battery technology improvements drive costs down significantly.',
    imageUrl: 'https://images.pexels.com/photos/3844554/pexels-photo-3844554.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T09:30:00Z',
    category: 'technology',
    source: 'Auto Tech',
  },
  
  // Sports
  {
    id: '9',
    headline: 'Olympic Records Shattered at Winter Games',
    description: 'Athletes break multiple world records in figure skating and speed skating events in thrilling competitions.',
    imageUrl: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T13:15:00Z',
    category: 'sports',
    source: 'Olympic News',
  },
  {
    id: '10',
    headline: 'Championship Game Sets Viewership Records',
    description: 'Historic match draws over 200 million viewers worldwide, becoming most-watched sporting event of the decade.',
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2025-01-14T12:00:00Z',
    category: 'sports',
    source: 'Sports Central',
  },
];

export const categories = [
  { key: 'topstories', title: 'Top Stories' },
  { key: 'trending', title: 'Trending' },
  { key: 'technology', title: 'Technology' },
  { key: 'sports', title: 'Sports' },
] as const;