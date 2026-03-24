import Link from "next/link";
import type { YearlyArchiveGroup } from "@/lib/blog/types";

type MonthlyArchivePanelProps = {
  entries: YearlyArchiveGroup[];
};

export function MonthlyArchivePanel({ entries }: MonthlyArchivePanelProps) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4B4B4B]">Monthly Archive</h2>
      <ul className="mt-4 space-y-4">
        {entries.map((entry) => (
          <li key={entry.year} className="space-y-2">
            <Link
              href={`/blog/archive/${entry.year}`}
              className="inline-flex rounded-sm text-sm font-semibold text-[#1F1F1F] transition-colors hover:text-[#B23A3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {entry.year}
            </Link>
            <ul className="space-y-2 border-l border-[#E5E5E5] pl-3">
              {entry.months.map((monthEntry) => (
                <li key={`${monthEntry.year}-${monthEntry.month}`}>
                  <Link
                    href={`/blog/archive/${monthEntry.year}/${monthEntry.month}`}
                    className="rounded-sm text-sm text-[#1F1F1F] transition-colors hover:text-[#B23A3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {monthEntry.label} <span className="text-[#4B4B4B]">({monthEntry.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}