import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";
import { BlogTagLink } from "@/components/blog/blog-tag-link";

type BlogPostCardProps = {
  post: BlogPostSummary;
};

function formatPublishDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article data-testid="blog-post-card" className="space-y-3 border-b border-border pb-6">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">{formatPublishDate(post.publishDate)}</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          <Link
            href={`/blog/${post.slug}`}
            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {post.title}
          </Link>
        </h2>
      </header>

      <p className="text-base leading-7 text-muted-foreground">{post.abstract}</p>

      <ul className="flex flex-wrap gap-2" aria-label="Post tags">
        {post.tags.map((tag) => (
          <li key={tag}>
            <BlogTagLink tag={tag} />
          </li>
        ))}
      </ul>
    </article>
  );
}