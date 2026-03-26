import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomepageHero } from "@/components/homepage/homepage-hero";
import { HomepageSection } from "@/components/homepage/homepage-section";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

describe("HomepageHero", () => {
  it("renders the author name as an h1 heading", () => {
    render(
      <HomepageHero
        name="Rob Earlam"
        lead="Test intro text"
        imageSrc="/img/rob.png"
        imageAlt="Profile photo of Rob Earlam"
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Rob Earlam" })).toBeInTheDocument();
  });

  it("renders the intro lead text", () => {
    render(
      <HomepageHero
        name="Rob Earlam"
        lead="Engineering leader and software architect."
        imageSrc="/img/rob.png"
        imageAlt="Profile photo"
      />
    );
    expect(screen.getByText("Engineering leader and software architect.")).toBeInTheDocument();
  });

  it("renders the profile image with the supplied alt text", () => {
    render(
      <HomepageHero
        name="Rob Earlam"
        lead="Test"
        imageSrc="/img/rob.png"
        imageAlt="Profile photo of Rob Earlam"
      />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Profile photo of Rob Earlam");
  });
});

describe("HomepageSection", () => {
  it("renders the h2 section heading", () => {
    render(
      <HomepageSection heading="Latest Writing">
        <p>Content</p>
      </HomepageSection>
    );
    expect(screen.getByRole("heading", { level: 2, name: "Latest Writing" })).toBeInTheDocument();
  });

  it("renders children in the content area", () => {
    render(
      <HomepageSection heading="Latest Writing">
        <p data-testid="child-content">Content</p>
      </HomepageSection>
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders a CTA link when ctaLabel and ctaHref are supplied", () => {
    render(
      <HomepageSection heading="Latest Writing" ctaLabel="View all posts →" ctaHref="/blog">
        <p>Content</p>
      </HomepageSection>
    );
    const link = screen.getByRole("link", { name: "View all posts →" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("does not render a CTA link when ctaLabel and ctaHref are not supplied", () => {
    render(
      <HomepageSection heading="Latest Writing">
        <p>Content</p>
      </HomepageSection>
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
