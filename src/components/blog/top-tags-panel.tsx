import Link from "next/link";

type TopTagsPanelProps = {
  tags: string[];
  activeTag?: string;
};

export function TopTagsPanel({ tags, activeTag }: TopTagsPanelProps) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4B4B4B]">Top Tags</h2>
      <ul className="mt-4 space-y-3">
        {tags.map((tag) => {
          const isActive = activeTag === tag;

          return (
            <li key={tag}>
              <Link
                href={`/blog/tag/${tag}`}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-sm text-sm transition-colors hover:text-[#B23A3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive ? "font-semibold text-[#7A1C1C]" : "text-[#1F1F1F]",
                ].join(" ")}
              >
                {tag}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}