import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MonthlyArchivePanel } from "@/components/blog/monthly-archive-panel";
import { TopTagsPanel } from "@/components/blog/top-tags-panel";

describe("blog sidebar panels", () => {
  it("renders top tags as count-free links and marks the active tag", () => {
    render(<TopTagsPanel tags={["nextjs", "testing"]} activeTag="nextjs" />);

    const activeLink = screen.getByRole("link", { name: "nextjs" });
    const otherLink = screen.getByRole("link", { name: "testing" });

    expect(activeLink).toHaveAttribute("href", "/blog/tag/nextjs");
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(otherLink).toHaveAttribute("href", "/blog/tag/testing");
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it("renders archive entries with month counts", () => {
    render(
      <MonthlyArchivePanel
        entries={[
          { year: "2026", month: "03", label: "March 2026", count: 4 },
          { year: "2026", month: "02", label: "February 2026", count: 2 },
        ]}
      />
    );

    expect(screen.getByRole("link", { name: "March 2026 (4)" })).toHaveAttribute("href", "/blog/2026/03");
    expect(screen.getByRole("link", { name: "February 2026 (2)" })).toHaveAttribute("href", "/blog/2026/02");
  });
});