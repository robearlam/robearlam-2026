import { BlogFeedClient } from "@/components/blog/blog-feed-client";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { getPaginatedBlogPosts } from "@/lib/blog/posts";

const INITIAL_PAGE_SIZE = 5;

export default async function BlogPage() {
  const initialPage = await getPaginatedBlogPosts({
    limit: INITIAL_PAGE_SIZE,
    offset: 0,
  });

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Writing on engineering, product execution, and lessons from building software in the open.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <BlogFeedClient initialPosts={initialPage.posts} initialHasMore={initialPage.hasMore} />
        <BlogSidebar />
      </div>
    </section>
  );
}