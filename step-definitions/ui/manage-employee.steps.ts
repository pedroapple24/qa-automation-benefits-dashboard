import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../src/support/world';
import { DashboardPage } from '../../src/ui/pages/dashboard.page';
import { EditEmployeePage } from '../../src/ui/pages/edit-employee.page';
import { DeleteEmployeePage } from '../../src/ui/pages/delete-employee.page';
import { EmployeeFactory } from '../../src/factories/employee.factory';

When('I click the edit button for the created employee', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.clickEditForEmployee(
    this.createdEmployee.firstName,
    this.createdEmployee.lastName,
  );
});

When('I update the employee with new factory-generated data', async function (this: CustomWorld) {
  const updated = EmployeeFactory.build();
  this.createdEmployee = updated;
  const editPage = new EditEmployeePage(this.page);
  await editPage.updateForm({
    firstName: updated.firstName,
    lastName: updated.lastName,
    dependants: updated.dependants,
  });
});

Then('the updated employee info should appear in the dashboard table', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertEmployeeInTable(
    this.createdEmployee.firstName,
    this.createdEmployee.lastName,
    this.createdEmployee.dependants,
  );
});

When('I click the delete button for the created employee', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.clickDeleteForEmployee(
    this.createdEmployee.firstName,
    this.createdEmployee.lastName,
  );
});

When('I confirm the delete', async function (this: CustomWorld) {
  const deletePage = new DeleteEmployeePage(this.page);
  await deletePage.confirmDelete();
});

Then('the employee should no longer appear in the dashboard table', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.assertEmployeeNotInTable(
    this.createdEmployee.firstName,
    this.createdEmployee.lastName,
  );
});
