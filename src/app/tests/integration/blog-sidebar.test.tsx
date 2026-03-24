import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MonthlyArchivePanel } from "@/components/blog/monthly-archive-panel";
import { TopTagsPanel } from "@/components/blog/top-tags-panel";

describe("blog sidebar panels", () => {
  it("renders top tags as chip links with counts and marks the active tag", () => {
    render(<TopTagsPanel tags={[{ tag: "nextjs" }, { tag: "testing" }]} activeTag="nextjs" />);

    const activeLink = screen.getByRole("link", { name: /nextjs/i });
    const otherLink = screen.getByRole("link", { name: /testing/i });

    expect(activeLink).toHaveAttribute("href", "/blog/tag/nextjs");
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(otherLink).toHaveAttribute("href", "/blog/tag/testing");
  });

  it("renders yearly archive groups with linked year headings and month counts", () => {
    render(
      <MonthlyArchivePanel
        entries={[
          {
            year: "2026",
            count: 6,
            months: [
              { year: "2026", month: "03", label: "March", count: 4 },
              { year: "2026", month: "02", label: "February", count: 2 },
            ],
          },
        ]}
      />
    );

    expect(screen.getByRole("link", { name: "2026" })).toHaveAttribute("href", "/blog/archive/2026");
    expect(screen.getByRole("link", { name: "March (4)" })).toHaveAttribute("href", "/blog/archive/2026/03");
    expect(screen.getByRole("link", { name: "February (2)" })).toHaveAttribute("href", "/blog/archive/2026/02");
  });
});