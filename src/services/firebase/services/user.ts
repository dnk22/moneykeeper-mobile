// src/services/user/UserService.ts
import { databaseService } from './database';
import { FB_PATH } from '../config';

export interface UserProfile {
  uid: string;
  email: string | null;
  isOnboarded: boolean;
  createdAt: number; // Realtime DB thường lưu timestamp dưới dạng số (milliseconds)
  updatedAt: number;
}

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Tạo User Profile ban đầu khi người dùng mới đăng ký.
   */
  public async createUserProfile(uid: string, email: string | null): Promise<void> {
    const { data: existingProfile } = await databaseService.get<UserProfile>(uid);

    if (!existingProfile) {
      const now = Date.now();
      const newUserProfile: UserProfile = {
        uid,
        email,
        isOnboarded: false,
        createdAt: now,
        updatedAt: now,
      };
      const { error } = await databaseService.set(FB_PATH.USER_PROFILE, newUserProfile);
      if (error) {
        throw new Error(`Failed to create user profile: ${error.message}`);
      }
    } else {
      console.log('UserService: User profile already exists for', email);
    }
  }

  /**
   * Lấy User Profile của người dùng hiện tại.
   */
  public async getUserProfile(): Promise<UserProfile | null> {
    const { data: userProfile, error } = await databaseService.get<UserProfile>(
      FB_PATH.USER_PROFILE,
    );

    if (error) {
      return null;
    }

    return userProfile;
  }

  /**
   * Cập nhật trạng thái onboarding thành true.
   */
  public async markUserAsOnboarded(): Promise<void> {
    const { error } = await databaseService.update(FB_PATH.USER_PROFILE, {
      isOnboarded: true,
      updatedAt: Date.now(),
    });
    if (error) {
      throw new Error(`Failed to mark user as onboarded: ${error.message}`);
    }
  }

  /**
   * Cập nhật các thiết lập onboarding hoặc bất kỳ trường nào trong UserProfile.
   */
  public async updateOnboardingSettings(settings: Partial<UserProfile>): Promise<void> {
    const { error } = await databaseService.update(FB_PATH.USER_PROFILE, {
      ...settings,
      updatedAt: Date.now(),
    });
    if (error) {
      throw new Error(`Failed to update onboarding settings: ${error.message}`);
    }
  }

  /**
   * Lắng nghe thay đổi của User Profile trong Realtime Database.
   * Rất hữu ích nếu bạn muốn cập nhật UI ngay lập tức khi profile thay đổi.
   * @param callback Hàm sẽ được gọi khi dữ liệu profile thay đổi.
   * @returns Một hàm để hủy đăng ký listener.
   */
  public onUserProfileChange(callback: (profile: UserProfile | null) => void): () => void {
    return databaseService.onValue(FB_PATH.USER_PROFILE, callback);
  }
}

export const userService = UserService.getInstance();
