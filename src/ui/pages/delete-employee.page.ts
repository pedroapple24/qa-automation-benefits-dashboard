import { Page } from '@playwright/test';
import { deleteEmployeeLocators } from '../locators/app.locators';

export class DeleteEmployeePage {
  constructor(private readonly page: Page) {}

  async waitForModalOpen(): Promise<void> {
    await this.page
      .locator(deleteEmployeeLocators.confirmDeleteButton)
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async confirmDelete(): Promise<void> {
    await this.waitForModalOpen();
    await this.page.locator(deleteEmployeeLocators.confirmDeleteButton).click();
  }
}
