import { Page, expect } from '@playwright/test';
import { loginLocators } from '../locators/app.locators';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async enterUsername(username: string): Promise<void> {
    await this.page.locator(loginLocators.usernameInput).fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.locator(loginLocators.passwordInput).fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.page.locator(loginLocators.loginButton).click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async assertLoginPageLoaded(): Promise<void> {
    await expect(this.page.locator(loginLocators.usernameInput)).toBeVisible();
    await expect(this.page.locator(loginLocators.passwordInput)).toBeVisible();
    await expect(this.page.locator(loginLocators.loginButton)).toBeVisible();
  }

  async assertEmptyCredentialsErrors(): Promise<void> {
    await expect(this.page.locator(loginLocators.validationSummary)).toBeVisible();
    await expect(this.page.locator(loginLocators.usernameRequiredError)).toBeVisible();
    await expect(this.page.locator(loginLocators.passwordRequiredError)).toBeVisible();
  }
}
