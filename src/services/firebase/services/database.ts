import { FB_PATH } from '../config';
import { fireBaseAuthService } from './auth';
import { FirebaseDatabaseTypes, getDatabase } from '@react-native-firebase/database';

export class DatabaseError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

class DatabaseService {
  private static instance: DatabaseService;
  private database: FirebaseDatabaseTypes.Module;

  private constructor() {
    this.database = getDatabase();
    // Enable persistence for offline capabilities
    this.database.setPersistenceEnabled(false);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Lấy đường dẫn gốc của dữ liệu cho người dùng hiện tại.
   * Ví dụ: "users/YOUR_USER_UID"
   * @returns Đường dẫn dạng string hoặc null nếu không có người dùng đăng nhập.
   * @throws Error nếu không có người dùng đăng nhập.
   */
  private getUserProfilePath(): string {
    const currentUser = fireBaseAuthService.getCurrentUser();
    if (!currentUser) {
      throw { message: 'No authenticated user found.', code: 'auth/no-user' };
    }
    return `${FB_PATH.USERS}/${currentUser.uid}`;
  }

  public async getDefaultPath<T>(path: string): Promise<DatabaseResponse<T>> {
    try {
      const snapshot = await this.database.ref(path).once('value');
      const data = snapshot.val() as T;
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async get<T>(path: string): Promise<DatabaseResponse<T>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      const snapshot = await this.database.ref(fullPath).once('value');
      const data = snapshot.val() as T;
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async set(path: string, data: any): Promise<DatabaseResponse<void>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      await this.database.ref(fullPath).set(data);
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async update(path: string, updates: object): Promise<DatabaseResponse<void>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      await this.database.ref(fullPath).update(updates);
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async remove(path: string): Promise<DatabaseResponse<void>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      await this.database.ref(fullPath).remove();
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  /**
   * Đăng ký lắng nghe thay đổi dữ liệu theo thời gian thực tại một đường dẫn con
   * trong phạm vi dữ liệu của người dùng hiện tại.
   *
   * @param relativePath Đường dẫn con (ví dụ: 'profile', 'transactions')
   * @param callback Hàm sẽ được gọi khi dữ liệu thay đổi.
   * @returns Một hàm để hủy đăng ký listener.
   */
  public onValue<T>(relativePath: string = '', callback: (data: T | null) => void): () => void {
    let fullPath: string;
    try {
      fullPath = `${this.getUserProfilePath()}/${relativePath}`;
    } catch (error: any) {
      console.error(
        'DatabaseService: Cannot set up onValue listener, no authenticated user.',
        error.message,
      );
      callback(null);
      return () => {};
    }

    const ref = this.database.ref(fullPath);
    const listener = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      callback(snapshot.val() as T);
    };
    ref.on('value', listener);
    return () => ref.off('value', listener);
  }
}

export const databaseService = DatabaseService.getInstance();
