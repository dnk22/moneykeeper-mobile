import { storageService } from '../storage';
import { RefreshTokenResponse } from '../axios/types';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getAccessToken(): string | undefined {
    return storageService.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  }

  public getRefreshToken(): string | undefined {
    return storageService.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  public setTokens(tokens: RefreshTokenResponse): void {
    storageService.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.access_token);
    storageService.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refresh_token);
  }

  public clearTokens(): void {
    storageService.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    storageService.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  public hasValidAccessToken(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = AuthService.getInstance(); 