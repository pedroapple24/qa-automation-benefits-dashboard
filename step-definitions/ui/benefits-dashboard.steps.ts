import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { CustomWorld } from '../../src/support/world';
import { LoginPage } from '../../src/ui/pages/login.page';
import { DashboardPage } from '../../src/ui/pages/dashboard.page';

dotenv.config();

const UI_BASE_URL = process.env.UI_BASE_URL!;
const UI_USERNAME = process.env.UI_USERNAME!;
const UI_PASSWORD = process.env.UI_PASSWORD!;

Given('I navigate to the Paylocity login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate(UI_BASE_URL);
  await loginPage.assertLoginPageLoaded();
});

When('I enter valid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.enterUsername(UI_USERNAME);
  await loginPage.enterPassword(UI_PASSWORD);
});

When('I click the Log In button', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickLogin();
});

Then('I should see the Paylocity Benefits Dashboard title and the URL should contain {string}', async function (this: CustomWorld, expectedPath: string) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertDashboardTitleVisible();
  await dashboardPage.assertUrl(expectedPath);
});

Then('the dashboard table should display all required columns', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertAllColumnsVisible();
});

Then('the Add Employee button should be visible', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertAddEmployeeButtonVisible();
});

Then('I should see validation errors for missing credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.assertEmptyCredentialsErrors();
});

Then('the url should contain {string}', async function (this: CustomWorld, expectedUrl: string) {
  await expect(this.page).toHaveURL(new RegExp(expectedUrl));
});

When('I log out of the application', async function (this: CustomWorld) {
  await this.page.locator('xpath=//a[@href="/Prod/Account/LogOut"]').click();
  await this.page.waitForURL(/LogIn/);
});

When('I go back in the browser', async function (this: CustomWorld) {
  await this.page.goBack();
  await this.page.waitForLoadState('networkidle');
});

Then('I should be redirected to the login page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/Login/);
});
