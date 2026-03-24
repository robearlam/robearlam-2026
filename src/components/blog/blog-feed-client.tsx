"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import type { BlogPostSummary } from "@/lib/blog/types";

const PAGE_SIZE = 5;

type BlogFeedClientProps = {
  initialPosts: BlogPostSummary[];
  initialHasMore: boolean;
  tag?: string;
  year?: string;
  month?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

type BlogApiResponse = {
  posts: BlogPostSummary[];
  total: number;
  hasMore: boolean;
};

export function BlogFeedClient({ initialPosts, initialHasMore, tag, year, month, emptyTitle, emptyDescription }: BlogFeedClientProps) {
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts);
  const [offset, setOffset] = useState<number>(initialPosts.length);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const endpoint = useMemo(() => {
    const query = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });

    if (tag) {
      query.set("tag", tag);
    }

    if (year) {
      query.set("year", year);
    }

    if (month) {
      query.set("month", month);
    }

    return `/api/blog?${query.toString()}`;
  }, [month, offset, tag, year]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(endpoint, { method: "GET" });

      if (!response.ok) {
        throw new Error("Unable to load additional blog posts.");
      }

      const data = (await response.json()) as BlogApiResponse;
      setPosts((currentPosts) => [...currentPosts, ...data.posts]);
      setOffset((currentOffset) => currentOffset + data.posts.length);
      setHasMore(data.hasMore);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load additional blog posts.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, hasMore, isLoading]);

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

  if (posts.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold tracking-tight">{emptyTitle ?? "No posts found for this tag"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{emptyDescription ?? "Try another tag, or browse all posts from the main blog listing."}</p>
        <Link href="/blog" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">View all posts</Link>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-live="polite">
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {isLoading ? <p className="text-sm text-muted-foreground">Loading more posts...</p> : null}

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

      {!hasMore && posts.length > 0 ? <p className="text-sm text-muted-foreground">You have reached the end of the blog feed.</p> : null}
    </section>
  );
}