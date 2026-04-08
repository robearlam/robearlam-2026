import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BlogPage from "@/app/blog/page";
import BlogPostPage from "@/app/blog/(post)/[slug]/page";
import TagPage from "@/app/blog/tag/[tag]/page";
import { DISQUS_SHORTNAME } from "@/lib/blog/disqus";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

describe("blog comments integration", () => {
  // it("renders a comments section on blog detail pages", async () => {
  //   const page = await BlogPostPage({
  //     params: Promise.resolve({ slug: "upgrading-the-sugcon-sites-from-jss-to-the-content-sdk" }),
  //   });

  //   render(page);

  //   expect(screen.getByRole("heading", { level: 2, name: "Comments" })).toBeInTheDocument();
  //   expect(screen.getByTestId("disqus-thread")).toBeInTheDocument();
  //   expect(document.querySelector(`script[src="https://${DISQUS_SHORTNAME}.disqus.com/embed.js"]`)).toBeTruthy();
  // });

  it("does not render comments on the blog listing page", async () => {
    const page = await BlogPage();
    render(page);

    expect(screen.queryByRole("heading", { level: 2, name: "Comments" })).not.toBeInTheDocument();
  });

  it("does not render comments on tag listing pages", async () => {
    const page = await TagPage({ params: Promise.resolve({ tag: "Sitecore" }) });
    render(page);

    expect(screen.queryByRole("heading", { level: 2, name: "Comments" })).not.toBeInTheDocument();
  });
});
