import { Page } from '@playwright/test';
import { editEmployeeLocators } from '../locators/app.locators';
import { EmployeeFormData } from './add-employee.page';

export class EditEmployeePage {
  constructor(private readonly page: Page) {}

  async waitForModalOpen(): Promise<void> {
    await this.page
      .locator(editEmployeeLocators.updateButton)
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async updateForm(data: EmployeeFormData): Promise<void> {
    await this.waitForModalOpen();
    await this.page.locator(editEmployeeLocators.modalFirstName).clear();
    await this.page.locator(editEmployeeLocators.modalFirstName).fill(data.firstName);
    await this.page.locator(editEmployeeLocators.modalLastName).clear();
    await this.page.locator(editEmployeeLocators.modalLastName).fill(data.lastName);
    await this.page.locator(editEmployeeLocators.modalDependants).clear();
    await this.page.locator(editEmployeeLocators.modalDependants).fill(String(data.dependants));
    await this.page.locator(editEmployeeLocators.updateButton).click();
  }
}
