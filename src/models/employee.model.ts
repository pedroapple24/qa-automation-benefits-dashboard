export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  username: string;
  id: string;
  dependants: number;
  expiration: string;
  salary: number;
}

export interface EmployeeResponse {
  partitionKey: string;
  sortKey: string;
  username: string;
  id: string;
  firstName: string;
  lastName: string;
  dependants: number;
  expiration: string;
  salary: number;
  gross: number;
  benefitsCost: number;
  net: number;
}
