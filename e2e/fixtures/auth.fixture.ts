import { test as base, type Page } from "@playwright/test";
import { account, type Role } from "./accounts";
import { LoginPage } from "../pages/login.page";

type AuthFixtures = {
  loginAs: (role: Role) => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  loginAs: async ({ page }: { page: Page }, use) => {
    await use(async (role: Role) => {
      const a = account(role);
      const login = new LoginPage(page);
      await login.goto();
      await login.submit(a.email, a.password);
      if (role === "user") {
        // role=user is blocked — wait for toast/error, stays on login page
        await page.waitForTimeout(1500);
      } else {
        // wait for dashboard navigation AND cookie to be set before next step
        await page.waitForURL(/\/dashboard/);
        await page.waitForFunction(() =>
          document.cookie.includes("auth-token")
        );
      }
    });
  },
});

export const expect = test.expect;
