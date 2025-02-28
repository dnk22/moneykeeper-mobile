import { AxiosError } from 'axios';
import AxiosInstance from './instance';
import { ApiResponse } from './types';

// Function to make GET requests
export const get = async <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await AxiosInstance.get<T>(url, { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as AxiosError).message,
    };
  }
};

// Function to make POST requests
export const post = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await AxiosInstance.post<T>(url, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as AxiosError).message,
    };
  }
};

// Function to make PUT requests
export const put = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await AxiosInstance.put<T>(url, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as AxiosError).message,
    };
  }
};
