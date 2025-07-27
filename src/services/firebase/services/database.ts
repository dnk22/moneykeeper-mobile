import { FB_PATH } from '../config';
import { FirebaseError, FirebaseResponse } from '../types';
import { fireBaseAuthService } from './auth';
import { FirebaseDatabaseTypes, getDatabase } from '@react-native-firebase/database';

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

  public async getDefaultPath<T>(path: string): Promise<FirebaseResponse<T>> {
    try {
      const snapshot = await this.database.ref(path).once('value');
      const data = snapshot.val() as T;
      return { data, error: null };
    } catch (error: any) {
      throw new FirebaseError(error.code || 'unknown', error.message);
    }
  }

  public async get<T>(path: string): Promise<FirebaseResponse<T>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      const snapshot = await this.database.ref(fullPath).once('value');
      const data = snapshot.val() as T;
      return { data, error: null };
    } catch (error: any) {
      throw new FirebaseError(error.code || 'unknown', error.message);
    }
  }

  public async set(path: string, data: any): Promise<FirebaseResponse<void>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      await this.database.ref(fullPath).set(data);
      return { data: undefined, error: null };
    } catch (error: any) {
      throw new FirebaseError(error.code || 'unknown', error.message, true);
    }
  }

  public async update(path: string, updates: object): Promise<FirebaseResponse<void>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      await this.database.ref(fullPath).update(updates);
      return { data: undefined, error: null };
    } catch (error: any) {
      throw new FirebaseError(error.code || 'unknown', error.message);
    }
  }

  public async remove(path: string): Promise<FirebaseResponse<void>> {
    try {
      const fullPath = `${this.getUserProfilePath()}/${path}`;
      await this.database.ref(fullPath).remove();
      return { data: undefined, error: null };
    } catch (error: any) {
      throw new FirebaseError(error.code || 'unknown', error.message);
    }
  }

  /**
   * Xóa nhiều bản ghi trong Firebase Realtime Database.
   * Phương thức này tạo một đối tượng cập nhật với giá trị null cho mỗi đường dẫn cần xóa.
   *
   * @param pathsToDelete Một mảng các đường dẫn tương đối (ví dụ: 'transactions/id1', 'transactions/id2')
   * hoặc một đối tượng các đường dẫn với giá trị null nếu bạn muốn chỉ định
   * các đường dẫn khác nhau mà không cùng một gốc.
   * @example
   * // Xóa nhiều giao dịch trong cùng một collection
   * databaseService.removeMultiple(['transactions/transactionId1', 'transactions/transactionId2']);
   *
   * // Xóa các bản ghi ở nhiều vị trí khác nhau
   * databaseService.removeMultiple({
   * 'transactions/transactionId1': null,
   * 'balances/balanceId1': null,
   * });
   */
  public async removeMultiple(
    pathsToDelete: string[] | { [relativePath: string]: null },
  ): Promise<FirebaseResponse<void>> {
    try {
      const userProfilePath = this.getUserProfilePath();
      const updates: { [key: string]: null } = {};

      if (Array.isArray(pathsToDelete)) {
        // Nếu là mảng các đường dẫn, chuyển đổi thành đối tượng updates
        pathsToDelete.forEach((relativePath) => {
          updates[`${userProfilePath}/${relativePath}`] = null;
        });
      } else {
        // Nếu đã là đối tượng, chỉ cần thêm userProfilePath vào mỗi key
        for (const relativePath in pathsToDelete) {
          if (Object.prototype.hasOwnProperty.call(pathsToDelete, relativePath)) {
            updates[`${userProfilePath}/${relativePath}`] = null;
          }
        }
      }

      // Thực hiện cập nhật root để xóa nhiều đường dẫn cùng lúc
      await this.database.ref('/').update(updates);
      return { data: undefined, error: null };
    } catch (error: any) {
      throw new FirebaseError(error.code || 'unknown', error.message);
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
