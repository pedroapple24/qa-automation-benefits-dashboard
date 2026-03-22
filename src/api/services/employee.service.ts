import { APIResponse } from '@playwright/test';
import { BaseClient } from '../clients/base.client';
import { EmployeeRequest } from '../../models/employee.model';

export class EmployeeService {
  private readonly basePath = '/employees';
  private readonly basePluralPath = '/Employees';

  constructor(private readonly client: BaseClient) {}

  async createEmployee(data: EmployeeRequest): Promise<APIResponse> {
    return this.client.post(this.basePath, data);
  }

  async getEmployees(): Promise<APIResponse> {
    return this.client.get(this.basePluralPath);
  }

  async getEmployeeById(id: string): Promise<APIResponse> {
    return this.client.get(`${this.basePluralPath}/${id}`);
  }

  async updateEmployee(data: EmployeeRequest): Promise<APIResponse> {
    return this.client.put(this.basePluralPath, data);
  }

  async deleteEmployee(id: string): Promise<APIResponse> {
    return this.client.delete(`${this.basePluralPath}/${id}`);
  }
}
