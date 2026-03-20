export type BlogFrontmatter = {
  title: string;
  slug: string;
  publishDate: string;
  disqusId: string;
  abstract: string;
  tags: string[];
  heroImage?: string;
};

export type BlogPostSummary = BlogFrontmatter;

export type BlogPost = BlogPostSummary & {
  content: string;
};

export type BlogQueryParams = {
  limit: number;
  offset: number;
  tag?: string;
};

export type BlogQueryResult = {
  posts: BlogPostSummary[];
  total: number;
  hasMore: boolean;
};