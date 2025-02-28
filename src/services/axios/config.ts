import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse, RetryConfig } from './types';
import { InterceptorService } from './interceptors';

export class AxiosService {
  private static instance: AxiosService;
  private axiosInstance: AxiosInstance;
  private interceptorService: InterceptorService;
  private retryConfig: RetryConfig = {
    retry: true,
    retryCount: 3,
    retryDelay: 1000,
    shouldRetry: (error: ApiError) => {
      const { response } = error;
      return response?.status === 429 || (response?.status ?? 0) >= 500;
    },
  };

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.interceptorService = new InterceptorService(
      this.axiosInstance,
      this.retryConfig
    );
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  // Public methods for making requests
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // Method to update retry configuration
  public updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  // Method to get axios instance (if needed)
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const axiosService = AxiosService.getInstance(); 