import { AxiosError, AxiosResponse } from 'axios';
import AxiosInstance from './instance';
import { HTTP_STATUS, API_ENDPOINTS } from '../constants/api.constants';
import { ApiResponse, ApiError } from './types';
import { getToken, getRefreshToken, setToken, removeTokens } from './storage';

// Request interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
AxiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config;

    if (
      originalRequest &&
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const response = await AxiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
          refreshToken,
        });

        if (response.data.accessToken) {
          setToken(response.data.accessToken);
          AxiosInstance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`;
          return AxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        removeTokens();
        // You might want to redirect to login screen here
      }
    }

    const apiError: ApiError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    };

    return Promise.reject({
      success: false,
      error: apiError,
    });
  },
);
