import Link from "next/link";
import type { MonthlyArchiveEntry } from "@/lib/blog/types";

type MonthlyArchivePanelProps = {
  entries: MonthlyArchiveEntry[];
};

export function MonthlyArchivePanel({ entries }: MonthlyArchivePanelProps) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4B4B4B]">Monthly Archive</h2>
      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={`${entry.year}-${entry.month}`}>
            <Link
              href={`/blog/archive/${entry.year}/${entry.month}`}
              className="rounded-sm text-sm text-[#1F1F1F] transition-colors hover:text-[#B23A3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {entry.label} <span className="text-[#4B4B4B]">({entry.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}