import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { APIRequestContext, APIResponse, Browser, Page } from '@playwright/test';
import { EmployeeService } from '../api/services/employee.service';
import { EmployeeRequest } from '../models/employee.model';

export class CustomWorld extends World {
  // API context
  apiContext!: APIRequestContext;
  employeeService!: EmployeeService;

  // UI context
  browser!: Browser;
  page!: Page;

  // Shared state between steps
  response!: APIResponse;
  secondResponse?: APIResponse;
  responseBody!: Record<string, unknown>;
  employeeData!: EmployeeRequest;
  createdEmployeeId?: string;
  submittedId?: string;
  createdEmployee!: EmployeeRequest;
  updatedSalary?: number;
  updatedDependants?: number;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
