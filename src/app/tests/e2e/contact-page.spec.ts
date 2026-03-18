import { expect, test } from "@playwright/test";

const requiredProfiles = [
  ["BlueSky", "https://bsky.app/profile/robearlam.com"],
  ["Mastodon", "https://mastodon.social/@RobEarlam"],
  ["GitHub", "https://github.com/robearlam"],
  ["LinkedIn", "https://www.linkedin.com/in/rob-earlam/"],
  ["YouTube", "https://www.youtube.com/playlist?list=PLmTNwpFzRErCW5ibZAkSO8HFSW0Rkiplj"],
  ["Dev.to", "https://dev.to/robearlam"],
] as const;

test("contact route is discoverable from navigation and keeps shared shell", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Contact" }).first().click();

  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Contact" })).toBeVisible();
});

test("contact page renders all required external profile links with secure attributes", async ({ page }) => {
  await page.goto("/contact");

  for (const [label, href] of requiredProfiles) {
    const link = page.getByRole("link", { name: `${label} profile` });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("mobile contact layout remains readable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/contact");

  await expect(page.getByRole("heading", { level: 1, name: "Contact" })).toBeVisible();

  const hasOverflow = await page.evaluate(() => {
    const root = document.scrollingElement;

    if (!root) {
      return true;
    }

    return root.scrollWidth > window.innerWidth;
  });

  expect(hasOverflow).toBe(false);
});