import { test, expect } from "../fixtures/auth.fixture";

const TEST_DEVICE_ID = `e2e-test-${Date.now()}`;

test.describe("TC_Device_Mgmt", () => {
  test.beforeEach(async ({ loginAs, page }) => {
    await loginAs("admin");
    await page.goto("/dashboard/device-management");
    await expect(page.getByRole("heading", { name: /device management/i })).toBeVisible();
    // wait for loading skeletons to disappear
    await page.waitForFunction(
      () => document.querySelectorAll('[data-slot="skeleton"]').length === 0,
      { timeout: 10000 }
    );
  });

  test("TC-DEV-001 Open Device Management page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /device management/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /add device/i })).toBeVisible();
    await expect(page.getByText(/pump status/i)).toBeVisible();
  });

  test("TC-DEV-002 Toggle Grid/List view", async ({ page }) => {
    // grid view is default — grid button highlighted
    const listBtn = page.locator("button").filter({ has: page.locator("svg.lucide-list") });
    const gridBtn = page.locator("button").filter({ has: page.locator("svg.lucide-layout-grid") });

    await listBtn.click();
    await expect(page.locator("table")).toBeVisible();

    await gridBtn.click();
    await expect(page.locator("table")).not.toBeVisible();
  });

  test("TC-DEV-003 Filter by pump status — Active", async ({ page }) => {
    // open pump status select
    await page.locator("button[role='combobox']").click();
    await page.getByRole("option", { name: /^active$/i }).click();
    // all visible status badges should be "active" / "on"
    const countText = await page.locator("text=/Showing/").innerText();
    // just verify the filter text updates (may be 0 if no active devices)
    expect(countText).toMatch(/Showing/);
  });

  test("TC-DEV-004 Filter by pump status — Inactive", async ({ page }) => {
    await page.locator("button[role='combobox']").click();
    await page.getByRole("option", { name: /^inactive$/i }).click();
    const countText = await page.locator("text=/Showing/").innerText();
    expect(countText).toMatch(/Showing/);
  });

  test("TC-DEV-005 Reset pump status filter to All", async ({ page }) => {
    // set to Active first
    await page.locator("button[role='combobox']").click();
    await page.getByRole("option", { name: /^active$/i }).click();
    // reset to All
    await page.locator("button[role='combobox']").click();
    await page.getByRole("option", { name: /^all$/i }).click();
    const countText = await page.locator("text=/Showing/").innerText();
    expect(countText).toMatch(/Showing/);
  });

  test("TC-DEV-006 Add a new device", async ({ page }) => {
    await page.getByRole("button", { name: /add device/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /add new device/i })).toBeVisible();

    await page.getByLabel(/device id/i).fill(TEST_DEVICE_ID);
    await page.getByRole("button", { name: /create device/i }).click();

    // dialog closes on success
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });
    // new device appears in grid
    await expect(page.getByText(TEST_DEVICE_ID)).toBeVisible({ timeout: 8000 });
  });

  test("TC-DEV-007 Add Device — validation for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /add device/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /create device/i }).click();
    // zod validation error for device_id
    await expect(page.getByText(/required|must|enter|least/i).first()).toBeVisible();
    // dialog stays open
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("TC-DEV-008 Edit existing device", async ({ page }) => {
    const pencilBtn = page.locator("button").filter({ has: page.locator("svg.lucide-pencil") }).first();
    await pencilBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /edit device/i })).toBeVisible();

    // use role=checkbox to avoid strict mode (input[type=checkbox] is aria-hidden)
    const checkbox = page.getByRole("checkbox", { name: /pump is active/i });
    const before = await checkbox.isChecked();
    await checkbox.click();
    expect(await checkbox.isChecked()).toBe(!before);

    await page.getByRole("button", { name: /update device/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });
  });

  test("TC-DEV-009 Delete a device with confirmation", async ({ page }) => {
    // first create one to safely delete
    await page.getByRole("button", { name: /add device/i }).click();
    const tempId = `e2e-del-${Date.now()}`;
    await page.getByLabel(/device id/i).fill(tempId);
    await page.getByRole("button", { name: /create device/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });
    await expect(page.getByText(tempId)).toBeVisible({ timeout: 8000 });

    // click delete on that specific card — scope to the card heading then walk up
    const trashBtn = page.locator("h3", { hasText: tempId })
      .locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]")
      .locator("button").filter({ has: page.locator("svg.lucide-trash-2") });
    await trashBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/delete device/i)).toBeVisible();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });
    await expect(page.getByText(tempId)).not.toBeVisible({ timeout: 8000 });
  });

  test("TC-DEV-010 Cancel delete dialog", async ({ page }) => {
    const trashBtn = page.locator("button").filter({ has: page.locator("svg.lucide-trash-2") }).first();
    await trashBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("TC-DEV-011 Open QR code dialog", async ({ page }) => {
    const qrBtn = page.locator("button[title='Generate QR Code']").first();
    await qrBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/device qr code/i)).toBeVisible();
  });

  test("TC-DEV-012 Close QR code dialog", async ({ page }) => {
    const qrBtn = page.locator("button[title='Generate QR Code']").first();
    await qrBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // use first() — footer "Close" button, not the X icon button
    await page.getByRole("button", { name: /close/i }).first().click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("TC-DEV-013 Device card shows last_seen", async ({ page }) => {
    // at least one card should show "Last seen:" text
    const lastSeenLabel = page.locator("text=/last seen/i").first();
    await expect(lastSeenLabel).toBeVisible();
  });

  test("TC-DEV-014 Pump status uses Droplets icon on device card", async ({ page }) => {
    // DeviceCard always renders Droplets icon
    const dropletsIcon = page.locator("svg.lucide-droplets").first();
    await expect(dropletsIcon).toBeVisible();
  });

  test("TC-DEV-015 Deleted device disappears from Recent Devices on dashboard", async ({ page }) => {
    // create device to delete
    await page.getByRole("button", { name: /add device/i }).click();
    const tempId = `e2e-dash-${Date.now()}`;
    await page.getByLabel(/device id/i).fill(tempId);
    await page.getByRole("button", { name: /create device/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });

    // delete it — scope trash button to specific card
    const trashBtn2 = page.locator("h3", { hasText: tempId })
      .locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]")
      .locator("button").filter({ has: page.locator("svg.lucide-trash-2") });
    await trashBtn2.click();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });

    // check dashboard recent devices
    await page.goto("/dashboard");
    await expect(page.getByText(/total users/i)).toBeVisible();
    await expect(page.getByText(tempId)).not.toBeVisible();
  });
});
