"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VideoCard } from "@/components/videos/video-card";
import type { VideoEntry } from "@/lib/videos/types";

const PAGE_SIZE = 6;

type VideosGridClientProps = {
  initialVideos: VideoEntry[];
  initialHasMore: boolean;
};

type VideosApiResponse = {
  videos: VideoEntry[];
  total: number;
  hasMore: boolean;
};

export function VideosGridClient({ initialVideos, initialHasMore }: VideosGridClientProps) {
  const [videos, setVideos] = useState<VideoEntry[]>(initialVideos);
  const [offset, setOffset] = useState<number>(initialVideos.length);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const query = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      });
      const response = await fetch(`/api/videos?${query.toString()}`, { method: "GET" });

      if (!response.ok) {
        throw new Error("Unable to load additional videos.");
      }

      const data = (await response.json()) as VideosApiResponse;
      setVideos((currentVideos) => [...currentVideos, ...data.videos]);
      setOffset((currentOffset) => currentOffset + data.videos.length);
      setHasMore(data.hasMore);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load additional videos.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, offset]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current || typeof window.IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "200px 0px",
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6" aria-labelledby="more-videos-heading">
      <h2 id="more-videos-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        More Videos
      </h2>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {videos.map((video) => (
          <VideoCard key={`${video.date}-${video.videoId}`} video={video} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {isLoading ? <p className="text-sm text-muted-foreground">Loading more videos...</p> : null}

      {loadError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-sm text-foreground">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              void loadMore();
            }}
            className="mt-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!hasMore && videos.length > 0 ? <p className="text-sm text-muted-foreground">You have reached the end of the video feed.</p> : null}
    </section>
  );
}