/**
 * Test Utils
 */

import { AxiosResponse, AxiosRequestConfig } from 'axios';

export class MockAxiosError extends Error {
  config: AxiosRequestConfig;

  request: object;

  response: AxiosResponse;

  status: number;

  isAxiosError: boolean;

  toJSON: () => AxiosResponse;

  constructor(message: string) {
    super(message);
    this.config = {};
    this.request = {};
    this.response = {
      data: {},
      status: 500,
      statusText: 'Internal server error',
      headers: {},
      config: {},
    };
    this.status = 500;
    this.name = 'AxiosError';
    this.isAxiosError = true;
    this.toJSON = () => this.response;
  }
}
