import navigationRef from 'navigation/helpers/navigate';
import { ROUTES } from 'navigation/constants/routes';
import { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse, ErrorResponse } from './types';
import { authService, RefreshTokenResponse } from 'services/auth';

export class InterceptorService {
  private refreshTokenRequest: Promise<RefreshTokenResponse> | null = null;

  constructor(
    private axiosInstance: AxiosInstance,
    private retryConfig: {
      retry: boolean;
      retryCount: number;
      retryDelay: number;
      shouldRetry: (error: ApiError) => boolean;
    },
  ) {
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this),
    );

    this.axiosInstance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this),
    );
  }

  private async handleRequest(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  private handleRequestError(error: AxiosError): Promise<AxiosError> {
    console.error('Request error:', error);
    return Promise.reject(error);
  }

  private handleResponse(response: any) {
    return response;
  }

  private async handleResponseError(error: ApiError): Promise<any> {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      return this.handleTokenExpiration(originalRequest);
    }

    if (
      this.retryConfig.retry &&
      this.retryConfig.shouldRetry(error) &&
      (!originalRequest._retry || originalRequest._retry < this.retryConfig.retryCount)
    ) {
      return this.handleRetry(error, originalRequest);
    }

    return Promise.reject(this.formatError(error));
  }

  private async handleTokenExpiration(
    originalRequest: AxiosRequestConfig & { _retry?: number },
  ): Promise<any> {
    try {
      originalRequest._retry = 1;

      if (!this.refreshTokenRequest) {
        this.refreshTokenRequest = this.refreshToken();
      }

      const tokens = await this.refreshTokenRequest;
      this.refreshTokenRequest = null;

      authService.setTokens(tokens);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
      }
      return this.axiosInstance(originalRequest);
    } catch (error) {
      this.refreshTokenRequest = null;
      this.handleRefreshTokenError();
      return Promise.reject(error);
    }
  }

  private async handleRetry(
    error: ApiError,
    originalRequest: AxiosRequestConfig & { _retry?: number },
  ): Promise<any> {
    const currentRetry = originalRequest._retry || 0;
    originalRequest._retry = currentRetry + 1;

    const delay = this.retryConfig.retryDelay * Math.pow(2, currentRetry);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.axiosInstance(originalRequest);
  }

  private async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = authService.getRefreshToken();
    const response = await this.axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      {
        refresh_token: refreshToken,
      },
    );
    return response.data.data;
  }

  private handleRefreshTokenError(): void {
    authService.clearTokens();
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.AUTH);
    }
  }

  private formatError(error: ApiError): ErrorResponse {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
    };
  }
}
