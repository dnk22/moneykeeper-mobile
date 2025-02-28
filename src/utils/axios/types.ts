export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  status?: number;
  message?: string;
  code?: string;
}
