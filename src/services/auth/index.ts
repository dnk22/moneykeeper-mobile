import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
} from '@react-native-firebase/auth';
import Keychain from 'react-native-keychain';
import { TOKEN_KEYS } from 'utils/constants/api';
import { TFirebaseAuthResponse, TLogin, TRegister } from 'utils/types/auth';

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

  // firebase authentication methods
  // --- Đăng nhập/Đăng ký với Firebase ---
  public async firebaseSignIn({ email, password }: TLogin): Promise<TFirebaseAuthResponse> {
    try {
      await getAuth().signInWithEmailAndPassword(email, password);
      return { success: true, message: 'Đăng nhập thành công!' };
    } catch (error: any) {
      let message = 'Đăng nhập thất bại. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Người dùng không tồn tại. Vui lòng đăng ký tài khoản mới.';
          break;
        case 'auth/wrong-password':
          message = 'Mật khẩu không chính xác. Vui lòng thử lại.';
          break;
        case 'auth/invalid-email':
          message = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
          break;
        case 'auth/too-many-requests':
          message = 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.';
          break;
        default:
          message = message;
      }
      return { success: false, message };
    }
  }

  public async firebaseSignUp({
    email,
    password,
    name,
  }: TRegister): Promise<TFirebaseAuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
      return { success: true, message: 'Đăng ký thành công!' };
    } catch (error: any) {
      let message = 'Đăng ký thất bại. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
          break;
        case 'auth/invalid-email':
          message = 'Email không hợp lệ.';
          break;
        case 'auth/weak-password':
          message = 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.';
          break;
        default:
          message = message;
      }
      return { success: false, message };
    }
  }

  public async firebaseSignOut(): Promise<TFirebaseAuthResponse> {
    try {
      await getAuth().signOut();
      return { success: true, message: 'Đăng xuất thành công!' };
    } catch (error) {
      return {
        success: false,
        message: 'Đăng xuất thất bại. Vui lòng thử lại.',
      };
    }
  }
}

export const authService = AuthService.getInstance();
