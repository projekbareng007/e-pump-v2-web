import { test, expect } from "../fixtures/auth.fixture";

test.describe("TC_Navigation", () => {
  test("TC-NAV-001 Sidebar items — superuser sees all nav including User Activity", async ({ page, loginAs }) => {
    await loginAs("superuser");
    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /user management/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /device management/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /user activity/i })).toBeVisible();
  });

  test("TC-NAV-002 Sidebar hides User Activity for admin", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /user management/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /device management/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /user activity/i })).not.toBeVisible();
  });

  test("TC-NAV-003 Sidebar collapses and expands", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    // sidebar trigger button collapses sidebar
    const trigger = page.locator('[data-sidebar="trigger"]');
    await trigger.click();
    // after collapse, nav text labels hidden (icon-only mode)
    await expect(page.getByText("User Management")).not.toBeVisible();
    // expand again
    await trigger.click();
    await expect(page.getByText("User Management")).toBeVisible();
  });

  test("TC-NAV-004 NavUser dropdown items — Profile and Log out visible", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    await page.locator('[data-sidebar="footer"] button').click();
    await expect(page.getByRole("menuitem", { name: /profile/i })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /log\s*out|sign\s*out/i })).toBeVisible();
  });

  test("TC-NAV-005 NavUser — Profile navigation", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    await page.locator('[data-sidebar="footer"] button').click();
    await page.getByRole("menuitem", { name: /profile/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
  });

  test("TC-NAV-006 NavUser — Log out clears session", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    await page.locator('[data-sidebar="footer"] button').click();
    await page.getByRole("menuitem", { name: /log\s*out|sign\s*out/i }).click();
    await expect(page).toHaveURL(/\/$|\/login/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "auth-token")).toBeFalsy();
  });

  test("TC-NAV-007 Direct nav to device-management via sidebar link", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /device management/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/device-management/);
    await expect(page.getByRole("heading", { name: /device management/i })).toBeVisible();
  });

  test("TC-NAV-008 Server-side role resolution — no flicker on load", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    // sidebar should be immediately present without skeleton/loading state
    await expect(page.locator('[data-sidebar="sidebar"]')).toBeVisible();
    // nav items rendered without delay (server rendered)
    await expect(page.getByText("User Management")).toBeVisible();
  });

  test("TC-NAV-009 Unauthorized deep link redirects to /", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard/user-management");
    await expect(page).toHaveURL(/(\/$|\/?from=)/);
  });

  test("TC-NAV-010 Avatar initials derived from user name", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    // NavUser shows initials in AvatarFallback in sidebar footer
    const footer = page.locator('[data-sidebar="footer"]');
    const avatar = footer.locator('[data-slot="avatar-fallback"]');
    await expect(avatar).toBeVisible();
    const initials = await avatar.innerText();
    // initials should be 1-2 uppercase chars
    expect(initials).toMatch(/^[A-Z]{1,2}$/);
  });
});
