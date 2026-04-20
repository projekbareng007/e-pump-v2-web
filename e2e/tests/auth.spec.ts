import { test, expect } from "../fixtures/auth.fixture";
import { account } from "../fixtures/accounts";
import { LoginPage } from "../pages/login.page";

test.describe("TC_Authentication", () => {
  test("TC-AUTH-001 Open root page renders the Login screen", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await page.locator('a[href="/register"]').click();
  });

  test("TC-AUTH-002 Login with valid superuser credentials", async ({ page, loginAs }) => {
    await loginAs("superuser");
    await expect(page).toHaveURL(/\/dashboard/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "auth-token")).toBeTruthy();
  });

  test("TC-AUTH-003 Login with valid admin credentials", async ({ page, loginAs }) => {
    await loginAs("admin");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("TC-AUTH-004 role=user is blocked from dashboard", async ({ page, loginAs }) => {
    await loginAs("user");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/$|\/\?/);
  });

  test("TC-AUTH-005 Login with invalid credentials shows error", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit("wrong@example.com", "badpassword");
    await expect(page.getByText(/invalid|incorrect|unauthor|denied|failed/i).first()).toBeVisible({ timeout: 10000 });
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "auth-token")).toBeFalsy();
  });

  test("TC-AUTH-006 Login form validation — empty fields", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submitBtn.click();
    await expect(page.getByText(/required|must|enter/i).first()).toBeVisible();
  });

  test("TC-AUTH-007 Login form validation — invalid email format", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.email.fill("not-an-email");
    await login.password.fill("whatever");
    await login.submitBtn.click();
    await expect(page.getByText(/valid email|email format|invalid email|please enter/i)).toBeVisible();
  });

  test("TC-AUTH-008 Open Register page from login screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /register|sign\s*up|create account/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("TC-AUTH-011 Register form validation", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /register|sign\s*up|create/i }).click();
    await expect(page.getByText(/required|must|enter/i).first()).toBeVisible();
  });

  test("TC-AUTH-012 Logout from NavUser dropdown", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    // NavUser trigger — SidebarMenuButton wrapping avatar in sidebar footer
    await page.locator('[data-sidebar="footer"] button').click();
    await page.getByRole("menuitem", { name: /log\s*out|sign\s*out/i }).click();
    await expect(page).toHaveURL(/\/$|\/login/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "auth-token")).toBeFalsy();
  });

  test("TC-AUTH-013 Access /dashboard without cookie", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/(\/$|\/?from=)/);
  });

  test("TC-AUTH-014 Access /dashboard/user-activity as admin is forbidden", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard/user-activity");
    // admin (not superuser) is redirected away from user-activity
    await expect(page).not.toHaveURL(/\/dashboard\/user-activity/);
  });

  test("TC-AUTH-015 Auth cookie survives full page reload", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/dashboard");
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
