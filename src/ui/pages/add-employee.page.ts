import { Page, expect } from '@playwright/test';
import { addEmployeeLocators } from '../locators/app.locators';

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  dependants: number;
}

export class AddEmployeePage {
  constructor(private readonly page: Page) {}

  async fillAndSubmit(data: EmployeeFormData): Promise<void> {
    await this.page
      .locator('xpath=//div[@id="employeeModal"][contains(@class,"show")]')
      .waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator(addEmployeeLocators.firstNameInput).fill(data.firstName);
    await this.page.locator(addEmployeeLocators.lastNameInput).fill(data.lastName);
    await this.page.locator(addEmployeeLocators.dependantsInput).fill(String(data.dependants));
    await this.page.locator(addEmployeeLocators.addButton).click();
  }

  async assertModalElementsVisible(): Promise<void> {
    await this.page
      .locator('xpath=//div[@id="employeeModal"][contains(@class,"show")]')
      .waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.page.locator(addEmployeeLocators.modalTitle)).toBeVisible();
    await expect(this.page.locator(addEmployeeLocators.firstNameInput)).toBeVisible();
    await expect(this.page.locator(addEmployeeLocators.lastNameInput)).toBeVisible();
    await expect(this.page.locator(addEmployeeLocators.dependantsInput)).toBeVisible();
    await expect(this.page.locator(addEmployeeLocators.addButton)).toBeVisible();
    await expect(this.page.locator(addEmployeeLocators.cancelButton)).toBeVisible();
  }
}
