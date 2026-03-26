export type VideoFrontmatter = {
  title: string;
  videoId: string;
  date: string;
};

export type VideoEntry = VideoFrontmatter;

export type VideoQueryParams = {
  limit: number;
  offset: number;
};

export type VideoQueryResult = {
  videos: VideoEntry[];
  total: number;
  hasMore: boolean;
};
