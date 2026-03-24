import { BlogCommentsEmbed } from "@/components/blog/blog-comments-embed";

type BlogCommentsSectionProps = {
  disqusId: string;
  slug: string;
  title: string;
};

export function BlogCommentsSection({ disqusId, slug, title }: BlogCommentsSectionProps) {
  return (
    <section className="space-y-4 border-t border-border pt-10" aria-labelledby="comments-heading">
      <div className="space-y-1">
        <h2 id="comments-heading" className="text-2xl font-semibold tracking-tight">
          Comments
        </h2>
        <p className="text-sm text-muted-foreground">Join the discussion for this post below.</p>
      </div>

      <BlogCommentsEmbed identifier={disqusId} title={title} urlPath={`/blog/${slug}`} />
    </section>
  );
}
