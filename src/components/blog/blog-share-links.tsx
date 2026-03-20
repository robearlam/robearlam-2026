type BlogShareLinksProps = {
  title: string;
  slug: string;
};

type ShareLink = {
  platform: string;
  href: string;
};

const SITE_BASE_URL = "https://robearlam.com";

export function BlogShareLinks({ title, slug }: BlogShareLinksProps) {
  const postUrl = `${SITE_BASE_URL}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  const links: ShareLink[] = [
    {
      platform: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      platform: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      platform: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      platform: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      platform: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  return (
    <section aria-labelledby="share-post-title" className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5">
      <h2 id="share-post-title" className="text-base font-semibold tracking-tight">
        Share this post
      </h2>
      <ul className="flex flex-wrap gap-2" aria-label="Social sharing links">
        {links.map((link) => (
          <li key={link.platform}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {link.platform}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}