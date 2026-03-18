import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage from "@/app/contact/page";

const requiredProfiles = [
  ["BlueSky", "https://bsky.app/profile/robearlam.com"],
  ["Mastodon", "https://mastodon.social/@RobEarlam"],
  ["GitHub", "https://github.com/robearlam"],
  ["LinkedIn", "https://www.linkedin.com/in/rob-earlam/"],
  ["YouTube", "https://www.youtube.com/playlist?list=PLmTNwpFzRErCW5ibZAkSO8HFSW0Rkiplj"],
  ["Dev.to", "https://dev.to/robearlam"],
] as const;

describe("contact page", () => {
  it("renders a contact heading, intro copy, and direct contact method", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
  });

  it("renders all required social links with accessible names and secure external attributes", () => {
    render(<ContactPage />);

    for (const [label, href] of requiredProfiles) {
      const profileLink = screen.getByRole("link", { name: `${label} profile` });

      expect(profileLink).toHaveAttribute("href", href);
      expect(profileLink).toHaveAttribute("target", "_blank");
      expect(profileLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("does not render contact form controls or submit actions", () => {
    const { container } = render(<ContactPage />);

    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("input")).toBeNull();
    expect(container.querySelector("textarea")).toBeNull();
    expect(screen.queryByRole("button", { name: /submit|send/i })).not.toBeInTheDocument();
  });
});