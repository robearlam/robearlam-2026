import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import type { BlogPostSummary } from "@/lib/blog/types";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

const basePost: BlogPostSummary = {
  title: "Card test post",
  slug: "card-test-post",
  publishDate: "2025-05-10",
  disqusId: "card-test-post",
  abstract: "A short abstract used to verify the card metadata still renders.",
  tags: ["Nextjs", "Testing"],
};

describe("BlogPostCard", () => {
  it("renders the hero image when one is provided", () => {
    render(<BlogPostCard post={{ ...basePost, heroImage: "/img/blog-images/custom-hero.png" }} />);

    const image = screen.getByRole("img", { name: "Hero image for Card test post" });
    expect(image).toHaveAttribute("src", "/img/blog-images/custom-hero.png");
  });

  it("uses the placeholder image when heroImage is missing", () => {
    render(<BlogPostCard post={basePost} />);

    const image = screen.getByRole("img", { name: "Placeholder image for Card test post" });
    expect(image).toHaveAttribute("src", "/img/blog-images/blog-placeholder.png");
  });

  it("keeps image and title links pointed at the same destination", () => {
    render(<BlogPostCard post={basePost} />);

    const imageLink = screen.getByRole("link", { name: "Placeholder image for Card test post" });
    const titleLink = screen.getByRole("link", { name: "Card test post" });

    expect(imageLink).toHaveAttribute("href", "/blog/card-test-post");
    expect(titleLink).toHaveAttribute("href", "/blog/card-test-post");
  });

  it("preserves publish date, abstract, and tags", () => {
    render(<BlogPostCard post={basePost} />);

    expect(screen.getByText("10 May 2025")).toBeInTheDocument();
    expect(screen.getByText("A short abstract used to verify the card metadata still renders.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "#Nextjs" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "#Testing" })).toBeInTheDocument();
  });

  it("renders listing cards with a compact horizontal layout when requested", () => {
    render(<BlogPostCard post={basePost} layout="horizontalCompact" />);

    expect(screen.getByTestId("blog-post-card")).toHaveClass("flex");
    expect(screen.getByRole("link", { name: "Placeholder image for Card test post" })).toHaveClass("w-28");
  });
});