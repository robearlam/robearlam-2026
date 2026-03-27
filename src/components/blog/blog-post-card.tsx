import Link from "next/link";
import Image from "next/image";
import type { BlogPostSummary } from "@/lib/blog/types";
import { BlogTagLink } from "@/components/blog/blog-tag-link";

type BlogPostCardProps = {
  post: BlogPostSummary;
  layout?: "vertical" | "horizontalCompact";
};

const BLOG_PLACEHOLDER_IMAGE = "/img/blog-images/blog-placeholder.png";

function formatPublishDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostCard({ post, layout = "vertical" }: BlogPostCardProps) {
  const hasHeroImage = Boolean(post.heroImage?.trim());
  const imageSrc = hasHeroImage ? post.heroImage! : BLOG_PLACEHOLDER_IMAGE;
  const imageAlt = hasHeroImage ? `Hero image for ${post.title}` : `Placeholder image for ${post.title}`;
  const isHorizontalCompact = layout === "horizontalCompact";

  const articleClassName = isHorizontalCompact
    ? "flex items-stretch gap-4 border-b border-border pb-6"
    : "space-y-3 border-b border-border pb-6";

  const imageLinkClassName = isHorizontalCompact
    ? "relative hidden min-h-24 w-28 shrink-0 self-stretch overflow-hidden rounded-md border border-border transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:block sm:min-h-28 sm:w-36"
    : "block overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const imageClassName = isHorizontalCompact ? "object-cover" : "aspect-[16/9] w-full object-cover";

  return (
    <article data-testid="blog-post-card" className={articleClassName}>
      <Link
        href={`/blog/${post.slug}`}
        className={imageLinkClassName}
      >
        {isHorizontalCompact ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 640px) 9rem, 7rem"
            className={imageClassName}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={800}
            height={450}
            className={imageClassName}
          />
        )}
      </Link>

      <div className={isHorizontalCompact ? "min-w-0 flex-1 space-y-3" : "space-y-3"}>
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
      </div>
    </article>
  );
}