import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
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

  // firebase authentication methods
  // --- Đăng nhập/Đăng ký với Firebase ---
  public async firebaseSignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      return { success: true, message: 'Đăng nhập thành công!' };
    } catch (error: any) {
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Người dùng không tồn tại. Vui lòng đăng ký tài khoản mới.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác. Vui lòng thử lại.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.';
          break;
        default:
          errorMessage = errorMessage;
      }
      return { success: false, message: errorMessage };
    }
  }

  public async firebaseSignUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      return { success: true, message: 'Đăng ký thành công!' };
    } catch (error: any) {
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.';
          break;
        default:
          errorMessage = errorMessage;
      }
      return { success: false, message: errorMessage };
    }
  }

  public async firebaseSignOut(): Promise<{ success: boolean; message: string }> {
    try {
      await auth().signOut();
      return { success: true, message: 'Đăng xuất thành công!' };
    } catch (error) {
      return {
        success: false,
        message: 'Đăng xuất thất bại. Vui lòng thử lại.',
      };
    }
  }

  /**
   * Lấy Firebase ID Token hiện tại của người dùng.
   * @param forceRefresh Buộc Firebase làm mới token (mặc định là false)
   * @returns Firebase ID Token hoặc null nếu không có người dùng đăng nhập.
   */
  public async getFirebaseIdToken(forceRefresh: boolean = false): Promise<string | null> {
    const currentUser = auth().currentUser;
    if (currentUser) {
      try {
        const idTokenResult = await currentUser.getIdTokenResult(forceRefresh);
        return idTokenResult.token;
      } catch (error) {
        console.error('AuthService: Failed to get Firebase ID token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Lấy đối tượng người dùng Firebase hiện tại.
   * @returns Đối tượng FirebaseAuthTypes.User hoặc null.
   */
  public getCurrentFirebaseUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }
}

export const authService = AuthService.getInstance();
