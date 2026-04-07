import Link from "next/link";
import { getBlogTagHref } from "@/lib/blog/tags";

type TopTagsPanelProps = {
  tags: Array<{ tag: string; }>;
  activeTag?: string;
};

export function TopTagsPanel({ tags, activeTag }: TopTagsPanelProps) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] dark:border-border p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4B4B4B] dark:text-muted-foreground">Top Tags</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map(({ tag }) => {
          const isActive = activeTag === tag;

          return (
            <li key={tag}>
              <Link
                href={getBlogTagHref(tag)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "border-[#B23A3A] bg-[#F7E7E4] font-semibold text-[#7A1C1C] dark:border-primary dark:bg-muted dark:text-foreground"
                    : "border-[#D9D4CD] bg-[#FAF8F4] text-[#1F1F1F] hover:border-[#B23A3A] hover:text-[#B23A3A] dark:border-border dark:bg-card dark:text-foreground dark:hover:border-primary dark:hover:text-foreground",
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