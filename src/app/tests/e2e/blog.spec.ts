import { expect, test } from "@playwright/test";

test("blog listing supports infinite scroll loading", async ({ page }) => {
  await page.goto("/blog");

  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
  await expect(page.getByTestId("blog-post-card")).toHaveCount(5);

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await expect(page.getByTestId("blog-post-card")).toHaveCount(10);
});

test("blog detail exposes tags and social links with secure new-tab attributes", async ({ page }) => {
  await page.goto("/blog");
  await page.getByTestId("blog-post-card").first().getByRole("link").first().click();

  await expect(page).toHaveURL(/\/blog\/[^/]+$/);

  const sharePlatforms = ["Facebook", "LinkedIn", "Reddit", "X", "Bluesky"] as const;

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
  await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
});