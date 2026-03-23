import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CustomWorld } from '../../src/support/world';
import { EmployeeFactory } from '../../src/factories/employee.factory';
import { EmployeeResponse } from '../../src/models/employee.model';

// ─── Shared Given ────────────────────────────────────────────────────────────

Given('I have valid employee data', function (this: CustomWorld) {
  this.employeeData = EmployeeFactory.build();
});

Given('I have valid employee data with {int} dependants', function (this: CustomWorld, dependants: number) {
  this.employeeData = EmployeeFactory.build({ dependants, salary: 52000 });
});

Given('I have valid employee data with a custom id', function (this: CustomWorld) {
  const customId = faker.string.uuid();
  this.submittedId = customId;
  this.employeeData = EmployeeFactory.build({ id: customId });
});

Given('I have valid employee data with salary {int}', function (this: CustomWorld, salary: number) {
  this.employeeData = EmployeeFactory.build({ salary });
});

Given('I have valid employee data with a past expiration date', function (this: CustomWorld) {
  this.employeeData = EmployeeFactory.build({ expiration: '1993-04-26T08:36:44.858Z' });
});

Given('I have valid employee data with lastName {string}', function (this: CustomWorld, lastName: string) {
  this.employeeData = EmployeeFactory.build({ lastName });
});

Given('an employee exists in the system', async function (this: CustomWorld) {
  this.employeeData = EmployeeFactory.build();
  this.response = await this.employeeService.createEmployee(this.employeeData);
  const body = (await this.response.json()) as EmployeeResponse;
  this.createdEmployeeId = body.id;
});

// ─── POST ─────────────────────────────────────────────────────────────────────

When('I send a POST request to create the employee', async function (this: CustomWorld) {
  this.response = await this.employeeService.createEmployee(this.employeeData);
  this.responseBody = await this.response.json() as Record<string, unknown>;
  this.createdEmployeeId = this.responseBody['id'] as string;
});

When('I send a second POST request with the same employee data', async function (this: CustomWorld) {
  this.secondResponse = await this.employeeService.createEmployee(this.employeeData);
});

// ─── GET All ──────────────────────────────────────────────────────────────────

When('I send a GET request to retrieve all employees', async function (this: CustomWorld) {
  this.response = await this.employeeService.getEmployees();
  this.responseBody = await this.response.json() as Record<string, unknown>;
});

// ─── GET by ID ────────────────────────────────────────────────────────────────

When('I send a GET request with the employee ID', async function (this: CustomWorld) {
  this.response = await this.employeeService.getEmployeeById(this.createdEmployeeId!);
  this.responseBody = await this.response.json() as Record<string, unknown>;
});

When('I send a GET request with a non-existent employee ID', async function (this: CustomWorld) {
  this.response = await this.employeeService.getEmployeeById(faker.string.uuid());
});

// ─── PUT ──────────────────────────────────────────────────────────────────────

When(
  'I send a PUT request with updated salary {int} and dependants {int}',
  async function (this: CustomWorld, salary: number, dependants: number) {
    this.updatedSalary = salary;
    this.updatedDependants = dependants;

    const updatedData = {
      ...this.employeeData,
      id: this.createdEmployeeId!,
      salary,
      dependants,
    };

    this.response = await this.employeeService.updateEmployee(updatedData);
    this.responseBody = await this.response.json() as Record<string, unknown>;
  }
);

When('I send a PUT request with username {string}', async function (this: CustomWorld, username: string) {
  const updatedData = {
    ...this.employeeData,
    id: this.createdEmployeeId!,
    username,
  };
  this.response = await this.employeeService.updateEmployee(updatedData);
  this.responseBody = await this.response.json() as Record<string, unknown>;
});

When('I send a PUT request with a non-existent employee id', async function (this: CustomWorld) {
  const nonExistentData = EmployeeFactory.build({ id: faker.string.uuid() });
  this.response = await this.employeeService.updateEmployee(nonExistentData);
  this.responseBody = await this.response.json() as Record<string, unknown>;
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

When('I send a DELETE request with the employee ID', async function (this: CustomWorld) {
  this.response = await this.employeeService.deleteEmployee(this.createdEmployeeId!);
});

When('I send a DELETE request with a non-existent employee ID', async function (this: CustomWorld) {
  this.response = await this.employeeService.deleteEmployee(faker.string.uuid());
});

// ─── Then: Status ─────────────────────────────────────────────────────────────

Then('the response status should be {int}', function (this: CustomWorld, expectedStatus: number) {
  expect(this.response.status()).toBe(expectedStatus);
});

// ─── Then: Create assertions ──────────────────────────────────────────────────

Then(
  'the response body should contain the employee firstName and lastName',
  function (this: CustomWorld) {
    expect(this.responseBody['firstName']).toBe(this.employeeData.firstName);
    expect(this.responseBody['lastName']).toBe(this.employeeData.lastName);
  }
);

Then(
  'the response body should contain the employee dependants and salary',
  function (this: CustomWorld) {
    expect(this.responseBody['dependants']).toBe(this.employeeData.dependants);
    // The API assigns its own salary value on creation — assert it is a positive number
    expect(typeof this.responseBody['salary']).toBe('number');
    expect(this.responseBody['salary'] as number).toBeGreaterThan(0);
  }
);

Then(
  'the response should include calculated fields gross benefitsCost and net',
  function (this: CustomWorld) {
    expect(this.responseBody['gross']).toBeDefined();
    expect(this.responseBody['benefitsCost']).toBeDefined();
    expect(this.responseBody['net']).toBeDefined();
    expect(this.responseBody['gross'] as number).toBeGreaterThan(0);
    expect(this.responseBody['benefitsCost'] as number).toBeGreaterThan(0);
    expect(this.responseBody['net'] as number).toBeGreaterThan(0);
  }
);

// ─── Then: Business rules assertions ─────────────────────────────────────────

Then('the response gross pay should be {string}', function (this: CustomWorld, expected: string) {
  expect(Number(this.responseBody['gross'])).toBeCloseTo(Number(expected), 2);
});

Then('the response benefits cost should be {string}', function (this: CustomWorld, expected: string) {
  expect(Number(this.responseBody['benefitsCost'])).toBeCloseTo(Number(expected), 2);
});

Then('the response net pay should be {string}', function (this: CustomWorld, expected: string) {
  expect(Number(this.responseBody['net'])).toBeCloseTo(Number(expected), 2);
});

// ─── Then: GET All assertions ─────────────────────────────────────────────────

Then('the response should return a list of employees', function (this: CustomWorld) {
  const employees = this.responseBody as unknown as EmployeeResponse[];
  expect(Array.isArray(employees)).toBe(true);
  expect(employees.length).toBeGreaterThan(0);
});

Then('each employee should have the required fields', function (this: CustomWorld) {
  const employees = this.responseBody as unknown as EmployeeResponse[];
  for (const employee of employees) {
    expect(employee.id).toBeDefined();
    expect(employee.firstName).toBeDefined();
    expect(employee.lastName).toBeDefined();
    expect(employee.salary).toBeDefined();
    expect(employee.gross).toBeDefined();
    expect(employee.benefitsCost).toBeDefined();
    expect(employee.net).toBeDefined();
  }
});

// ─── Then: GET by ID assertions ───────────────────────────────────────────────

Then('the response body should match the created employee', function (this: CustomWorld) {
  expect(this.responseBody['id']).toBe(this.createdEmployeeId);
  expect(this.responseBody['firstName']).toBe(this.employeeData.firstName);
  expect(this.responseBody['lastName']).toBe(this.employeeData.lastName);
  expect(this.responseBody['dependants']).toBe(this.employeeData.dependants);
});

// ─── Then: PUT assertions ─────────────────────────────────────────────────────

Then(
  'the response body should reflect the updated salary and dependants',
  function (this: CustomWorld) {
    expect(this.responseBody['salary']).toBe(this.updatedSalary);
    expect(this.responseBody['dependants']).toBe(this.updatedDependants);
  }
);

// ─── Then: Bug assertions ─────────────────────────────────────────────────────

Then('no employee record should contain a username field', function (this: CustomWorld) {
  const employees = this.responseBody as unknown as EmployeeResponse[];
  for (const employee of employees) {
    expect(Object.keys(employee)).not.toContain('username');
  }
});

Then('no employee record should contain an expiration field', function (this: CustomWorld) {
  const employees = this.responseBody as unknown as EmployeeResponse[];
  for (const employee of employees) {
    expect(Object.keys(employee)).not.toContain('expiration');
  }
});

Then('benefitsCost and net should have at most 2 decimal places', function (this: CustomWorld) {
  const employees = this.responseBody as unknown as EmployeeResponse[];
  for (const employee of employees) {
    const benefitsCostDecimals = (employee.benefitsCost.toString().split('.')[1] ?? '').length;
    const netDecimals = (employee.net.toString().split('.')[1] ?? '').length;
    expect(benefitsCostDecimals).toBeLessThanOrEqual(2);
    expect(netDecimals).toBeLessThanOrEqual(2);
  }
});

Then('the response id should match the submitted id', function (this: CustomWorld) {
  expect(this.responseBody['id']).toBe(this.submittedId);
});

Then('the response salary should be {int}', function (this: CustomWorld, expectedSalary: number) {
  expect(this.responseBody['salary']).toBe(expectedSalary);
});

Then('the second response status should be {int}', function (this: CustomWorld, expectedStatus: number) {
  expect(this.secondResponse!.status()).toBe(expectedStatus);
});

