/**
 * remove this line when use
 */
export {};
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { firebaseApp } from './config';

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface AuthResponse<T> {
  data: T | null;
  error: AuthError | null;
}

class AuthService {
  private static instance: AuthService;
  private auth: FirebaseAuthTypes.Module;

  private constructor() {
    this.auth = auth(firebaseApp);
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AuthResponse<FirebaseAuthTypes.UserCredential>> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return { data: userCredential, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new AuthError(error.code || 'unknown', error.message),
      };
    }
  }

  public async signOut(): Promise<AuthResponse<void>> {
    try {
      await this.auth.signOut();
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new AuthError(error.code || 'unknown', error.message),
      };
    }
  }

  public onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void
  ): () => void {
    return this.auth.onAuthStateChanged(callback);
  }

  public getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  public async resetPassword(email: string): Promise<AuthResponse<void>> {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new AuthError(error.code || 'unknown', error.message),
      };
    }
  }

  public async updateProfile(
    profile: Partial<FirebaseAuthTypes.UpdateProfile>
  ): Promise<AuthResponse<void>> {
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
        error: new AuthError(error.code || 'unknown', error.message),
      };
    }
  }
}

export const authService = AuthService.getInstance();
