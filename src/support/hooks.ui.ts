import { Before, After, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(30000);
import { chromium, request } from '@playwright/test';
import { CustomWorld } from './world';
import { BaseClient } from '../api/clients/base.client';
import { EmployeeService } from '../api/services/employee.service';

Before({ tags: '@ui' }, async function (this: CustomWorld) {
  const headless = process.env.UI_HEADLESS !== 'false';

  this.browser = await chromium.launch({ headless });
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

After({ tags: '@ui' }, async function (this: CustomWorld) {
  await this.page?.close();
  await this.browser?.close();
});

AfterAll(async function () {
  const apiContext = await request.newContext();
  const employeeService = new EmployeeService(new BaseClient(apiContext));

  try {
    const res = await employeeService.getEmployees();
    const employees: { id: number }[] = await res.json();

    for (const emp of employees) {
      await employeeService.deleteEmployee(String(emp.id));
    }
  } catch {
    // Cleanup failure is non-blocking
  } finally {
    await apiContext.dispose();
  }
});
