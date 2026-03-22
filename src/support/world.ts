import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { EmployeeService } from '../api/services/employee.service';
import { EmployeeRequest } from '../models/employee.model';

export class CustomWorld extends World {
  // API context — replaced with `page: Page` for UI tests
  apiContext!: APIRequestContext;
  employeeService!: EmployeeService;

  // Shared state between steps
  response!: APIResponse;
  responseBody!: Record<string, unknown>;
  employeeData!: EmployeeRequest;
  createdEmployeeId?: string;
  updatedSalary?: number;
  updatedDependants?: number;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
