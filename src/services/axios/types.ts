import { AxiosError, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiError = AxiosError<ErrorResponse>;

export type ApiSuccess<T> = AxiosResponse<ApiResponse<T>>;

export interface RetryConfig {
  retry: boolean;
  retryCount: number;
  retryDelay: number;
  shouldRetry: (error: ApiError) => boolean;
}
