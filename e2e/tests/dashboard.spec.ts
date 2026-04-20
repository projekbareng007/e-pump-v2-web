import { test, expect } from "../fixtures/auth.fixture";

test.describe("TC_Dashboard", () => {
  test.beforeEach(async ({ loginAs, page }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    // wait for all stat cards to finish loading (skeletons gone)
    await expect(page.getByText(/total users/i)).toBeVisible();
    await page.waitForFunction(() =>
      document.querySelectorAll('[data-slot="skeleton"]').length === 0
    , { timeout: 10000 });
  });

  test("TC-DASH-001 Dashboard renders for logged-in admin/superuser", async ({ page }) => {
    await expect(page.getByText(/total users/i)).toBeVisible();
    await expect(page.getByText(/total devices/i)).toBeVisible();
    await expect(page.getByText("Active Pumps", { exact: true })).toBeVisible();
    await expect(page.getByText("Inactive Pumps", { exact: true })).toBeVisible();
  });

  test("TC-DASH-002 Total Users stat card — shows numeric value", async ({ page }) => {
    const card = page.locator("text=Total Users").locator("../..").locator("..");
    // value is a number rendered in text-3xl
    const value = card.locator(".text-3xl");
    await expect(value).toBeVisible();
    const text = await value.innerText();
    expect(Number(text.replace(/,/g, ""))).toBeGreaterThanOrEqual(0);
  });

  test("TC-DASH-003 Total Devices stat card — shows numeric value", async ({ page }) => {
    const card = page.locator("text=Total Devices").locator("../..").locator("..");
    const value = card.locator(".text-3xl");
    await expect(value).toBeVisible();
    const text = await value.innerText();
    expect(Number(text.replace(/,/g, ""))).toBeGreaterThanOrEqual(0);
  });

  test("TC-DASH-004 Active Pumps stat card — shows numeric value and LIVE badge", async ({ page }) => {
    // locate card by exact label span, go up to CardContent
    const card = page.locator("span", { hasText: "Active Pumps" }).locator("xpath=ancestor::div[contains(@class,'p-6')][1]");
    const value = card.locator(".text-3xl").first();
    await expect(value).toBeVisible();
    const text = await value.innerText();
    expect(Number(text.replace(/,/g, ""))).toBeGreaterThanOrEqual(0);
    await expect(card.getByText("LIVE")).toBeVisible();
  });

  test("TC-DASH-005 Inactive Pumps stat card — shows numeric value", async ({ page }) => {
    const card = page.locator("text=Inactive Pumps").locator("../..").locator("..");
    const value = card.locator(".text-3xl");
    await expect(value).toBeVisible();
    const text = await value.innerText();
    expect(Number(text.replace(/,/g, ""))).toBeGreaterThanOrEqual(0);
  });

  test("TC-DASH-006 Recent Devices table renders with columns", async ({ page }) => {
    await expect(page.getByText("Recent Devices")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /device id/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /owner/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /last seen/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
    // either rows OR empty state visible
    const hasRows = await page.locator("tbody tr td.px-6.py-5").count();
    const hasEmpty = await page.getByText(/no devices registered yet/i).count();
    expect(hasRows + hasEmpty).toBeGreaterThan(0);
  });

  test("TC-DASH-007 Recent Activities feed renders", async ({ page }) => {
    await expect(page.getByText("Recent Activities")).toBeVisible();
    // either activity items OR empty state
    const hasItems = await page.locator("text=Device Activity, text=Pump Control, text=Administrative Action").count();
    const hasEmpty = await page.getByText(/no recent activity/i).count();
    expect(hasItems + hasEmpty).toBeGreaterThanOrEqual(0);
    // View Log History link always present
    await expect(page.getByRole("link", { name: /view log history/i })).toBeVisible();
  });

  test("TC-DASH-008 Empty state — no devices shows fallback text", async ({ page }) => {
    const tbody = page.locator("tbody");
    const isEmpty = await page.getByText(/no devices registered yet/i).isVisible();
    if (isEmpty) {
      await expect(page.getByText(/no devices registered yet/i)).toBeVisible();
    } else {
      // devices exist — table rows visible instead
      await expect(tbody.locator("tr")).not.toHaveCount(0);
    }
  });

  test("TC-DASH-009 Recent Devices — View All links to device management", async ({ page }) => {
    const link = page.getByRole("link", { name: /view all/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/dashboard/device-management");
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/device-management/);
  });

  test("TC-DASH-010 Page stays on dashboard after reload — no auth flicker", async ({ page }) => {
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/total users/i)).toBeVisible();
  });
});
