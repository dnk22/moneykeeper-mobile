import Keychain from 'react-native-keychain';
import { TOKEN_KEYS } from 'utils/constants/api';

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async getAccessToken(): Promise<string | undefined> {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_KEYS.ACCESS_TOKEN,
    });
    return credentials ? credentials.password : undefined;
  }

  public async getRefreshToken(): Promise<string | undefined> {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_KEYS.REFRESH_TOKEN,
    });
    return credentials ? credentials.password : undefined;
  }

  public async setTokens(tokens: RefreshTokenResponse): Promise<void> {
    await Keychain.setGenericPassword(
      'username', // username is required but not used
      tokens.access_token,
      {
        service: TOKEN_KEYS.ACCESS_TOKEN,
      },
    );

    await Keychain.setGenericPassword('username', tokens.refresh_token, {
      service: TOKEN_KEYS.REFRESH_TOKEN,
    });
  }

  public async clearTokens(): Promise<void> {
    await Promise.all([
      Keychain.resetGenericPassword({
        service: TOKEN_KEYS.ACCESS_TOKEN,
      }),
      Keychain.resetGenericPassword({
        service: TOKEN_KEYS.REFRESH_TOKEN,
      }),
    ]);
  }

  public async hasValidAccessToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}

export const authService = AuthService.getInstance();
