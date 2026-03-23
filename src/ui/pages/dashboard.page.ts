import { Page, expect } from '@playwright/test';
import { dashboardLocators, editEmployeeLocators, deleteEmployeeLocators } from '../locators/app.locators';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async assertDashboardTitleVisible(): Promise<void> {
    await expect(this.page.locator(dashboardLocators.dashboardTitle)).toBeVisible();
  }

  async assertAddEmployeeButtonVisible(): Promise<void> {
    await expect(this.page.locator(dashboardLocators.addEmployeeButton)).toBeVisible();
  }

  async clickAddEmployee(): Promise<void> {
    await this.page.locator(dashboardLocators.addEmployeeButton).click({ force: true });
  }

  async clickEditForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.page.locator(
      `xpath=//table[@id="employeesTable"]//tbody//tr[td[text()="${firstName}"] and td[text()="${lastName}"]]`
    );
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.locator(editEmployeeLocators.editButton).click();
  }

  async clickDeleteForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.page.locator(
      `xpath=//table[@id="employeesTable"]//tbody//tr[td[text()="${firstName}"] and td[text()="${lastName}"]]`
    );
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.locator(deleteEmployeeLocators.deleteButton).click();
  }

  async assertEmployeeNotInTable(firstName: string, lastName: string): Promise<void> {
    await expect(this.page.locator(
      `xpath=//table[@id="employeesTable"]//tbody//tr[td[text()="${firstName}"] and td[text()="${lastName}"]]`
    )).not.toBeVisible({ timeout: 10000 });
  }

  async assertAllColumnsVisible(): Promise<void> {
    await expect(this.page.locator(dashboardLocators.colId)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colLastName)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colFirstName)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colDependents)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colSalary)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colGrossPay)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colBenefitsCost)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colNetPay)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.colActions)).toBeVisible();
  }

  async assertUrl(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath.replace(/\//g, '\\/')));
  }

  async assertEmployeeInTable(firstName: string, lastName: string, dependants: number): Promise<void> {
    const row = this.page.locator(
      `xpath=//table[@id="employeesTable"]//tbody//tr[td[text()="${firstName}"] and td[text()="${lastName}"]]`
    );
    await expect(row).toBeVisible({ timeout: 10000 });

    await expect(row.locator(`xpath=td[text()="${dependants}"]`)).toBeVisible();

    const cells = row.locator('td');
    const cellCount = await cells.count();
    // columns: Id, Last Name, First Name, Dependents, Salary, Gross Pay, Benefits Cost, Net Pay, Actions
    expect(cellCount).toBe(9);

    for (const colIndex of [4, 5, 6, 7]) {
      const cellText = await cells.nth(colIndex).innerText();
      expect(cellText.trim()).toMatch(/^\d+(\.\d+)?$/);
    }
  }

  async assertEmployeePayCalculations(
    firstName: string,
    lastName: string,
    expected: { grossPay: string; benefitsCost: string; netPay: string },
  ): Promise<void> {
    const row = this.page.locator(
      `xpath=//table[@id="employeesTable"]//tbody//tr[td[text()="${firstName}"] and td[text()="${lastName}"]]`
    );
    await expect(row).toBeVisible({ timeout: 10000 });

    const cells = row.locator('td');
    await expect(cells.nth(5)).toHaveText(expected.grossPay);
    await expect(cells.nth(6)).toHaveText(expected.benefitsCost);
    await expect(cells.nth(7)).toHaveText(expected.netPay);
  }

  async assertDashboardFullyLoaded(): Promise<void> {
    await this.assertDashboardTitleVisible();
    await this.assertAllColumnsVisible();
    await this.assertAddEmployeeButtonVisible();
  }
}
