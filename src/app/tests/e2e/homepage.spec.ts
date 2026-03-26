import { expect, test } from "@playwright/test";

test("homepage loads at / with HTTP 200 and renders a single h1 with Rob Earlam", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Rob Earlam" })).toBeVisible();
});

test("homepage renders exactly 3 blog post entries in the latest writing section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("blog-post-card")).toHaveCount(3);
});

test("homepage renders exactly 3 video entries in the latest videos section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("video-card")).toHaveCount(3);
});

test("homepage has a View all posts link pointing to /blog", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /view all posts/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/blog");
});

test("homepage has a View all videos link pointing to /videos", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /view all videos/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/videos");
});

test("homepage profile image has a non-empty alt attribute", async ({ page }) => {
  await page.goto("/");
  const img = page.getByRole("img", { name: "Profile photo of Rob Earlam" });
  await expect(img).toBeVisible();
  const alt = await img.getAttribute("alt");
  expect(alt).toBeTruthy();
});

test("no horizontal overflow on mobile viewport (375px)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const hasOverflow = await page.evaluate(() => {
    const root = document.scrollingElement;
    if (!root) return true;
    return root.scrollWidth > window.innerWidth;
  });
  expect(hasOverflow).toBe(false);
});

test("no horizontal overflow on desktop viewport (1280px)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const hasOverflow = await page.evaluate(() => {
    const root = document.scrollingElement;
    if (!root) return true;
    return root.scrollWidth > window.innerWidth;
  });
  expect(hasOverflow).toBe(false);
});
