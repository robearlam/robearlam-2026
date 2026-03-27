import type { Metadata } from "next";
import Link from "next/link";
import { BlogFeedClient } from "@/components/blog/blog-feed-client";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { getAllArchiveMonths, getMonthlyArchive, getPaginatedBlogPosts } from "@/lib/blog/posts";

const INITIAL_PAGE_SIZE = 5;

type ArchivePageProps = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const archiveEntries = await getMonthlyArchive();
  const entry = archiveEntries.find(
    (e) => e.year === resolvedParams.year && e.month === resolvedParams.month,
  );
  const label = entry?.label ?? `${resolvedParams.year}/${resolvedParams.month}`;

  return {
    title: `Blog Archive: ${label}`,
    robots: { index: false, follow: true },
  };
}

export async function generateStaticParams(): Promise<Array<{ year: string; month: string }>> {
  return getAllArchiveMonths();
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const resolvedParams = await params;
  const { year, month } = resolvedParams;

  const archiveEntries = await getMonthlyArchive();
  const entry = archiveEntries.find((e) => e.year === year && e.month === month);
  const label = entry?.label ?? `${year}/${month}`;

  const initialPage = await getPaginatedBlogPosts({
    limit: INITIAL_PAGE_SIZE,
    offset: 0,
    year,
    month,
  });

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Archive: {label}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Posts published in {label}.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {initialPage.posts.length === 0 ? (
            <section className="rounded-xl border border-border bg-card p-6 text-center">
              <h2 className="text-lg font-semibold tracking-tight">No posts found for this month</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no published posts for {label}. Try another month, or browse the full blog.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                View all blog posts
              </Link>
            </section>
          ) : (
            <BlogFeedClient
              initialPosts={initialPage.posts}
              initialHasMore={initialPage.hasMore}
              year={year}
              month={month}
            />
          )}
        </div>
        <BlogSidebar />
      </div>
    </section>
  );
}
