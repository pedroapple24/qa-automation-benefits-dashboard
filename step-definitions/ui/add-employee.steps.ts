import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../src/support/world';
import { DashboardPage } from '../../src/ui/pages/dashboard.page';
import { AddEmployeePage } from '../../src/ui/pages/add-employee.page';
import { EmployeeFactory } from '../../src/factories/employee.factory';

When('I click the Add Employee button', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await this.page.waitForTimeout(4000);
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
