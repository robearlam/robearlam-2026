import { expect, test } from "@playwright/test";

test("desktop viewport shows shared header, nav, main, and footer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary navigation/i })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("mobile viewport remains readable and avoids horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: /mobile primary navigation/i })).toBeVisible();

  const hasOverflow = await page.evaluate(() => {
    const root = document.scrollingElement;

    if (!root) {
      return true;
    }

    return root.scrollWidth > window.innerWidth;
  });

  expect(hasOverflow).toBe(false);
});

test("shared shell persists when navigating between routes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About" }).first().click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
});