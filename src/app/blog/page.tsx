import type { Metadata } from "next";
import { BlogFeedClient } from "@/components/blog/blog-feed-client";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { getPaginatedBlogPosts } from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "I've been writing software for many years, below you can find various things I've learned along the way, including tips, tutorials, and various insights I hope you find helpful.",
  path: "/blog",
});

const INITIAL_PAGE_SIZE = 5;

export default async function BlogPage() {
  const initialPage = await getPaginatedBlogPosts({
    limit: INITIAL_PAGE_SIZE,
    offset: 0,
  });

  return (
    <section className="space-y-10">
      <JsonLdScript
        data={webPageJsonLd({
          name: "Blog",
          description:
            "I've been writing software for many years, below you can find various things I've learned along the way, including tips, tutorials, and various insights I hope you find helpful.",
          path: "/blog",
        })}
      />
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I've been writing software for many years, below you can find various things I've learned along the way, including tips, tutorials, and various insights I hope you find helpful.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
        <BlogFeedClient initialPosts={initialPage.posts} initialHasMore={initialPage.hasMore} />
        <BlogSidebar />
      </div>
    </section>
  );
}