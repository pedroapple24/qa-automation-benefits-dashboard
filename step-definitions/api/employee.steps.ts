import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
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

// ─── DELETE ───────────────────────────────────────────────────────────────────

When('I send a DELETE request with the employee ID', async function (this: CustomWorld) {
  this.response = await this.employeeService.deleteEmployee(this.createdEmployeeId!);
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

