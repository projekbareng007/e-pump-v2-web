import type { Locator, Page } from "@playwright/test";

export class DashboardPage {
  readonly statTotalUsers: Locator;
  readonly statTotalDevices: Locator;
  readonly statActivePumps: Locator;
  readonly statInactivePumps: Locator;
  readonly recentDevices: Locator;
  readonly recentActivities: Locator;

  constructor(readonly page: Page) {
    this.statTotalUsers = page.getByText(/total users/i).first();
    this.statTotalDevices = page.getByText(/total devices/i).first();
    this.statActivePumps = page.getByText(/active pumps/i).first();
    this.statInactivePumps = page.getByText(/inactive pumps/i).first();
    this.recentDevices = page.getByRole("region", { name: /recent devices/i });
    this.recentActivities = page.getByRole("region", { name: /recent activities/i });
  }

  async goto() {
    await this.page.goto("/dashboard");
  }
}
