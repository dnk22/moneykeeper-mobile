// src/services/user/AppSettings.ts
import { databaseService } from './database';
import { FB_PATH } from '../config';
import { TSettings } from 'utils/types/store.type';

export class AppSettings {
  private static instance: AppSettings;

  private constructor() {}

  public static getInstance(): AppSettings {
    if (!AppSettings.instance) {
      AppSettings.instance = new AppSettings();
    }
    return AppSettings.instance;
  }

  /**
   * Lấy trạng thái thiết lập của người dùng.
   * Nếu không có thiết lập nào, sẽ trả về null.
   * @param path Đường dẫn tùy chọn để lấy thiết lập cụ thể.
   * @returns Trả về một phần của TSettings hoặc null nếu không có thiết lập nào.
   */
  public async getSettingStatus(path?: string): Promise<Partial<TSettings> | null> {
    const settingPath = path ? `${FB_PATH.SETTINGS}/${path}` : FB_PATH.SETTINGS;
    const { data, error } = await databaseService.get<TSettings>(settingPath);

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Cập nhật thiết lập của người dùng.
   * Nếu không có thiết lập nào, sẽ tạo mới với giá trị mặc định.
   * @param newSettings Thiết lập mới để cập nhật.
   * @returns Trả về void nếu cập nhật thành công, hoặc ném lỗi nếu có lỗi xảy ra.
   */
  public async updateSettings({
    path,
    newSettings,
  }: {
    path?: string;
    newSettings: Partial<TSettings>;
  }): Promise<Error | void> {
    try {
      if (path) {
        const currentSettings = await this.getSettingStatus(path);
        await databaseService.set(`${FB_PATH.SETTINGS}/${path}`, currentSettings);
        return;
      }
      const currentSettings = await this.getSettingStatus();
      const updatedSettings = { ...currentSettings, ...newSettings };
      await databaseService.set(FB_PATH.SETTINGS, updatedSettings);
    } catch (error) {
      return Error(
        `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export const appSettingsService = AppSettings.getInstance();
