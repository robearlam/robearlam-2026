import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Post not found</h1>
      <p className="text-muted-foreground">The blog post you requested does not exist. It may have been removed or the URL may be incorrect.</p>
      <Link
        href="/blog"
        className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Return to blog
      </Link>
    </section>
  );
}