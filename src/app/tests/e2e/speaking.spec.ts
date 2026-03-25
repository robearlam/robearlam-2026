import { expect, test } from "@playwright/test";

test("speaking page loads and shows both section headings", async ({ page }) => {
  await page.goto("/speaking");

  await expect(page.getByRole("heading", { level: 1, name: /speaking/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /upcoming/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /past/i })).toBeVisible();
});

test("year group accordion starts collapsed and toggles on pointer click", async ({ page }) => {
  await page.goto("/speaking");

  const trigger = page.getByRole("button").filter({ hasText: /^\d{4}$/ }).first();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("accordion trigger is keyboard accessible via Enter and Space", async ({ page }) => {
  await page.goto("/speaking");

  const trigger = page.getByRole("button").filter({ hasText: /^\d{4}$/ }).first();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("multiple year groups toggle independently", async ({ page }) => {
  await page.goto("/speaking");

  const triggers = page.getByRole("button").filter({ hasText: /^\d{4}$/ });
  const count = await triggers.count();
  if (count < 2) {
    test.skip();
    return;
  }

  const first = triggers.nth(0);
  const second = triggers.nth(1);

  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(second).toHaveAttribute("aria-expanded", "false");

  await second.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(second).toHaveAttribute("aria-expanded", "true");
});

test("no horizontal scrolling at mobile viewport (375px)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/speaking");

  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("no horizontal scrolling at desktop viewport (1280px)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/speaking");

  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
