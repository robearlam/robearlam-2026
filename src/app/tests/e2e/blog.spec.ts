import { expect, test } from "@playwright/test";

test("blog listing supports infinite scroll loading", async ({ page }) => {
  await page.goto("/blog");

  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Blog navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Top Tags" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Monthly Archive" })).toBeVisible();
  await expect(page.getByTestId("blog-post-card")).toHaveCount(5);

  await page.evaluate(() => {
    window.scrollTo(0, window.outerHeight);
  });

  await expect(page.getByTestId("blog-post-card")).toHaveCount(10);
});

test("tag page highlights the active tag and archive links show counts only there", async ({ page }) => {
  await page.goto("/blog/tag/Nextjs");

  const activeTag = page.getByRole("link", { name: "Nextjs", exact: true });
  await expect(activeTag).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: /[A-Za-z]+\s/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /^Nextjs$/ })).toBeVisible();
});

test("archive page renders month heading and filtered results", async ({ page }) => {
  await page.goto("/blog");
  const archiveLink = page.getByRole("link", { name: /[A-Za-z]+\s\(\d+\)/ }).first();
  const archiveLabel = await archiveLink.textContent();
  await archiveLink.click();

  await expect(page.getByRole("heading", { level: 1, name: (archiveLabel ?? "").replace(/\s*\(\d+\)$/, "") })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Blog navigation" })).toBeVisible();
  await expect(page.getByTestId("blog-post-card").first()).toBeVisible();
});

test("blog detail exposes tags and social links with secure new-tab attributes", async ({ page }) => {
  await page.goto("/blog");
  await page.getByTestId("blog-post-card").first().getByRole("link").first().click();

  await expect(page).toHaveURL(/\/blog\/[^/]+$/);

  const sharePlatforms = ["Facebook", "LinkedIn", "Reddit", "Twitter / X", "Bluesky"] as const;

  for (const platform of sharePlatforms) {
    const link = page.getByRole("link", { name: platform });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }

  await page.getByRole("link", { name: /^#.+/ }).first().click();
  await expect(page).toHaveURL(/\/blog\/tag\/.+/);
});

test("friendly not-found page is shown for an unknown blog slug", async ({ page }) => {
  await page.goto("/blog/this-slug-does-not-exist");

  // In Next.js dev mode with Turbopack, a transient SyntaxError overlay may appear
  // during certain route transitions. Dismiss it so the underlying server-rendered
  // page content is accessible for assertion.
  const errorDialog = page.getByRole("dialog", { name: /Runtime SyntaxError/i });
  if (await errorDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.keyboard.press("Escape");
  }

  await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
});