import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { DashboardPage } from '../../src/ui/pages/dashboard.page';
import { AddEmployeePage } from '../../src/ui/pages/add-employee.page';
import { EmployeeFactory } from '../../src/factories/employee.factory';
import { addEmployeeLocators } from '../../src/ui/locators/app.locators';

When('I click the Add Employee button', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await this.page.waitForLoadState('networkidle');
  await dashboardPage.clickAddEmployee();
});

Then('the Add Employee modal should display all required elements', async function (this: CustomWorld) {
  const addEmployeePage = new AddEmployeePage(this.page);
  await addEmployeePage.assertModalElementsVisible();
});

When('I fill in the Add Employee form with factory-generated data', async function (this: CustomWorld) {
  const employee = EmployeeFactory.build();
  this.createdEmployee = employee;
  const addEmployeePage = new AddEmployeePage(this.page);
  await addEmployeePage.fillAndSubmit({
    firstName: employee.firstName,
    lastName: employee.lastName,
    dependants: employee.dependants,
  });
});

When('I fill in the Add Employee form with {int} dependants', async function (this: CustomWorld, dependants: number) {
  const employee = EmployeeFactory.build({ dependants });
  this.createdEmployee = employee;
  const addEmployeePage = new AddEmployeePage(this.page);
  await addEmployeePage.fillAndSubmit({
    firstName: employee.firstName,
    lastName: employee.lastName,
    dependants: employee.dependants,
  });
});

Then('the employee row should show Gross Pay {string}, Benefits Cost {string}, and Net Pay {string}', async function (this: CustomWorld, grossPay: string, benefitsCost: string, netPay: string) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertEmployeePayCalculations(
    this.createdEmployee.firstName,
    this.createdEmployee.lastName,
    { grossPay, benefitsCost, netPay },
  );
});

Then('the new employee should appear in the dashboard table', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertEmployeeInTable(
    this.createdEmployee.firstName,
    this.createdEmployee.lastName,
    this.createdEmployee.dependants,
  );
});

When('I click Add without filling any fields', async function (this: CustomWorld) {
  await this.page
    .locator('xpath=//div[@id="employeeModal"][contains(@class,"show")]')
    .waitFor({ state: 'visible', timeout: 10000 });
  await this.page.locator(addEmployeeLocators.addButton).click();
});

Then('validation errors should be shown for all required fields', async function (this: CustomWorld) {
  await expect(
    this.page.locator('xpath=//div[contains(@class,"invalid-feedback")]').first()
  ).toBeVisible({ timeout: 3000 });
});

When('I fill in the Add Employee form with a single quote for firstName and lastName', async function (this: CustomWorld) {
  await this.page
    .locator('xpath=//div[@id="employeeModal"][contains(@class,"show")]')
    .waitFor({ state: 'visible', timeout: 10000 });
  await this.page.locator(addEmployeeLocators.firstNameInput).fill("'");
  await this.page.locator(addEmployeeLocators.lastNameInput).fill("'");
  await this.page.locator(addEmployeeLocators.dependantsInput).fill('0');
  await this.page.locator(addEmployeeLocators.addButton).click();
});

Then('a name validation error should be shown', async function (this: CustomWorld) {
  await expect(
    this.page.locator('xpath=//div[contains(@class,"invalid-feedback")]').first()
  ).toBeVisible({ timeout: 3000 });
});

Then('a validation warning should be shown for the dependants field', async function (this: CustomWorld) {
  await expect(
    this.page.locator('xpath=//div[contains(@class,"alert") or contains(@class,"warning")]')
  ).toBeVisible({ timeout: 3000 });
});
