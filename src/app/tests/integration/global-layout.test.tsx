import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteShell } from "@/components/site-shell";

const pathnameState = { value: "/" };

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameState.value,
}));

describe("global layout shell", () => {
  beforeEach(() => {
    pathnameState.value = "/";
  });

  it("renders semantic landmarks with a centered shell container", () => {
    const { container } = render(
      <SiteShell>
        <h1>Page Title</h1>
      </SiteShell>
    );

    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
    expect(container.innerHTML).toContain("max-w-[1100px]");
  });

  it("marks the current page link with a non-color cue", () => {
    pathnameState.value = "/about";

    const { container } = render(
      <SiteShell>
        <h1>About</h1>
      </SiteShell>
    );

    const aboutLink = container.querySelector('a[href="/about"]');
    const homeLink = container.querySelector('a[href="/"]');

    expect(aboutLink).toBeTruthy();
    expect(homeLink).toBeTruthy();
    expect(aboutLink).toHaveAttribute("aria-current", "page");
    expect(aboutLink?.className ?? "").toContain("underline");
    expect(homeLink).not.toHaveAttribute("aria-current");
  });
});