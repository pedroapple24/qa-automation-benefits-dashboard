import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../../config/config';

export class BaseClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string): Promise<APIResponse> {
    return this.request.get(`${config.BASE_URL}${path}`, {
      headers: {
        Authorization: config.AUTH_TOKEN,
      },
    });
  }

  async post(path: string, body: unknown): Promise<APIResponse> {
    return this.request.post(`${config.BASE_URL}${path}`, {
      data: body,
      headers: {
        Authorization: config.AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
    });
  }

  async put(path: string, body: unknown): Promise<APIResponse> {
    return this.request.put(`${config.BASE_URL}${path}`, {
      data: body,
      headers: {
        Authorization: config.AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${config.BASE_URL}${path}`, {
      headers: {
        Authorization: config.AUTH_TOKEN,
      },
    });
  }
}
