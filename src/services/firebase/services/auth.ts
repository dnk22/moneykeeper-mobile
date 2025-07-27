/**
 * TODO Summary:
 * 1. Authentication Methods:
 *    - [x] Email/Password Sign In
 *    - [x] Email/Password Sign Up
 *    - [ ] Google Sign In
 *    - [ ] Apple Sign In
 *    - [x] Sign Out
 *
 * 2. Password Management:
 *    - [x] Reset Password
 *    - [ ] Change Password
 *    - [ ] Update Email
 *    - [ ] Email Verification
 *
 * 3. Profile Management:
 *    - [x] Update Profile
 *    - [ ] Delete Account
 *    - [ ] Link Authentication Methods
 *    - [ ] Unlink Authentication Methods
 *
 * 4. Session Management:
 *    - [x] Get Current User
 *    - [x] Auth State Listener
 *    - [ ] Session Timeout
 *    - [ ] Force Sign Out
 *
 * 5. Error Handling:
 *    - [x] Basic Error Types
 *    - [ ] Detailed Error Messages
 *    - [ ] Rate Limiting
 *    - [ ] Retry Logic
 *
 * 6. Security Features:
 *    - [ ] Multi-Factor Authentication
 *    - [ ] Account Lockout
 *    - [ ] Security Logs
 *    - [ ] IP Tracking
 */
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { TLogin, TRegister } from 'utils/types/auth';
import { userService } from './user';
import defaultSettings from 'utils/constants/appSettings';
import { appSettingsFb } from '../db/appSettings';
import { FirebaseError, FirebaseResponse } from '../types';

class FireBaseAuthService {
  private static instance: FireBaseAuthService;
  private auth: FirebaseAuthTypes.Module;

  private constructor() {
    this.auth = getAuth();
  }

  public static getInstance(): FireBaseAuthService {
    if (!FireBaseAuthService.instance) {
      FireBaseAuthService.instance = new FireBaseAuthService();
    }
    return FireBaseAuthService.instance;
  }

  public getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  public onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback);
  }

  private getSignUpErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng bởi tài khoản khác';
      case 'auth/invalid-email':
        return 'Email không hợp lệ';
      case 'auth/operation-not-allowed':
        return 'Đăng ký bằng email/password chưa được kích hoạt';
      case 'auth/weak-password':
        return 'Mật khẩu cần có ít nhất 6 ký tự';
      default:
        return 'Đã có lỗi xảy ra khi đăng ký';
    }
  }

  private getSignInErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Người dùng không tồn tại. Vui lòng đăng ký tài khoản mới.';
      case 'auth/wrong-password':
        return 'Mật khẩu không chính xác. Vui lòng thử lại.';
      case 'auth/invalid-email':
        return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
      case 'auth/too-many-requests':
        return 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.';
      default:
        return 'Đã có lỗi xảy ra khi đăng nhập';
    }
  }

  // Authentication Methods
  public async signInWithEmailAndPassword({
    email,
    password,
  }: TLogin): Promise<FirebaseResponse<{ isOnBoard: boolean }>> {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      const userProfile = await userService.getUserProfile();
      if (!userProfile) {
        throw new FirebaseError('user-not-found', 'User profile not found');
      }
      return { data: { isOnBoard: userProfile.isOnboarded }, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new FirebaseError(
          error.code || 'unknown',
          this.getSignInErrorMessage(error.code) || error.message,
        ),
      };
    }
  }

  public async signUpWithEmailAndPassword({
    email,
    password,
    displayName,
  }: TRegister): Promise<FirebaseResponse<FirebaseAuthTypes.UserCredential>> {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);

      // If displayName is provided, update the user profile
      if (displayName && userCredential.user) {
        await userCredential.user.updateProfile({
          displayName,
        });
      }
      // Create user profile in the database
      await userService.createUserProfile({ email, displayName });

      // Initialize app settings for the new user
      await appSettingsFb.updateSettings({ newSettings: defaultSettings });

      // Send email verification
      // await userCredential.user?.sendEmailVerification();

      return { data: userCredential, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new FirebaseError(
          error.code || 'unknown',
          this.getSignUpErrorMessage(error.code) || error.message,
        ),
      };
    }
  }

  public async signOut(): Promise<FirebaseResponse<void>> {
    try {
      await this.auth.signOut();
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new FirebaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async resetPassword(email: string): Promise<FirebaseResponse<void>> {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new FirebaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async updateProfile(
    profile: Partial<FirebaseAuthTypes.UpdateProfile>,
  ): Promise<FirebaseResponse<void>> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await user.updateProfile(profile);
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new FirebaseError(error.code || 'unknown', error.message),
      };
    }
  }
}

export const fireBaseAuthService = FireBaseAuthService.getInstance();
