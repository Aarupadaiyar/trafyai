export interface ArticleCardData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  category: { slug: string; name: string };
  source: { slug: string; name: string };
  author: { slug: string; name: string } | null;
  publishedAt: string;
  readingTimeMins: number;
  popularityScore: number;
}

export interface TrendingCompany {
  name: string;
  slug: string;
  mentionCount: number;
}

export interface UpcomingEvent {
  name: string;
  date: string;
  location: string;
  url: string;
}
