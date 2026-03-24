import Link from "next/link";

type TopTagsPanelProps = {
  tags: Array<{ tag: string; }>;
  activeTag?: string;
};

export function TopTagsPanel({ tags, activeTag }: TopTagsPanelProps) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4B4B4B]">Top Tags</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map(({ tag }) => {
          const isActive = activeTag === tag;

          return (
            <li key={tag}>
              <Link
                href={`/blog/tag/${tag}`}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "border-[#B23A3A] bg-[#F7E7E4] font-semibold text-[#7A1C1C]"
                    : "border-[#D9D4CD] bg-[#FAF8F4] text-[#1F1F1F] hover:border-[#B23A3A] hover:text-[#B23A3A]",
                ].join(" ")}
              >
                <span>{tag}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}