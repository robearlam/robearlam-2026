import type { Metadata } from "next";
import Link from "next/link";
import { BlogFeedClient } from "@/components/blog/blog-feed-client";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { getAllBlogTags, getPaginatedBlogPosts } from "@/lib/blog/posts";

const INITIAL_PAGE_SIZE = 5;

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Blog Tag: ${resolvedParams.tag}`,
    robots: { index: false, follow: true },
  };
}

export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
  const tags = await getAllBlogTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const initialPage = await getPaginatedBlogPosts({
    limit: INITIAL_PAGE_SIZE,
    offset: 0,
    tag: resolvedParams.tag,
  });

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Posts tagged #{resolvedParams.tag}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Explore all posts grouped under this topic.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {initialPage.posts.length === 0 ? (
            <section className="rounded-xl border border-border bg-card p-6 text-center">
              <h2 className="text-lg font-semibold tracking-tight">No posts found for this tag</h2>
              <p className="mt-2 text-sm text-muted-foreground">Try another tag, or continue reading from the full blog listing.</p>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                View all blog posts
              </Link>
            </section>
          ) : (
            <BlogFeedClient initialPosts={initialPage.posts} initialHasMore={initialPage.hasMore} tag={resolvedParams.tag} />
          )}
        </div>
        <BlogSidebar activeTag={resolvedParams.tag} />
      </div>
    </section>
  );
}