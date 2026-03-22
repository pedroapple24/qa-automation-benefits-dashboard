import { Before, After } from '@cucumber/cucumber';
import { request } from '@playwright/test';
import { CustomWorld } from './world';
import { BaseClient } from '../api/clients/base.client';
import { EmployeeService } from '../api/services/employee.service';

Before(async function (this: CustomWorld) {
  this.apiContext = await request.newContext();
  const baseClient = new BaseClient(this.apiContext);
  this.employeeService = new EmployeeService(baseClient);
});

After(async function (this: CustomWorld) {
  if (this.createdEmployeeId) {
    try {
      await this.employeeService.deleteEmployee(this.createdEmployeeId);
    } catch {
      // Cleanup failure is non-blocking — test result is not affected
    }
  }
  await this.apiContext?.dispose();
});
