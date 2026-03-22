import { faker } from '@faker-js/faker';
import { EmployeeRequest } from '../models/employee.model';

export class EmployeeFactory {
  static build(overrides: Partial<EmployeeRequest> = {}): EmployeeRequest {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: '',
      id: faker.string.uuid(),
      dependants: faker.number.int({ min: 0, max: 32 }),
      expiration: faker.date.future().toISOString(),
      salary: faker.number.int({ min: 30000, max: 80000 }),
      ...overrides,
    };
  }
}
