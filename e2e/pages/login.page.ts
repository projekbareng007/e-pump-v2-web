import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submitBtn: Locator;
  readonly registerLink: Locator;

  constructor(readonly page: Page) {
    this.email = page.getByLabel(/email/i);
    this.password = page.getByLabel(/password/i);
    this.submitBtn = page.getByRole("button", { name: /log\s*in|sign\s*in/i });
    this.registerLink = page.getByRole("link", { name: /register|sign\s*up/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async submit(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitBtn.click();
  }
}
