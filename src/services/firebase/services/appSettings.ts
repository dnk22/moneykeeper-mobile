// src/services/user/AppSettings.ts
import { databaseService } from './database';
import { FB_PATH } from '../config';
import { COLOR_SCHEME } from 'resources/theme/constants';

export interface TAppSettings {
  dateFormat?: string;
  screenDefault?: string;
  hideBalance?: boolean;
  notification?: {
    enabled: boolean;
    sound: boolean;
    time: string;
  };
  theme: {
    auto?: boolean;
    darkMode?: boolean;
    color?: COLOR_SCHEME;
    bottomBarType: 'flat' | 'rounded';
  };
  report?: {
    startDayOfWeek?: number;
    startDateOfMonth?: number;
    startMonthOfYear?: number;
  };
  security?: {
    pinCode?: string;
    biometricEnabled?: boolean;
  };
  accounts: {
    sortByName?: boolean;
    sortOrder?: Array<string>[];
    sortOrderInGroup?: Array<{ key: string; value: Array<string> }>[];
    groupByType?: boolean;
    isViewActive?: boolean;
  };
  transactions: {
    display: {
      income?: boolean;
      expense?: boolean;
      amount?: boolean;
      description?: boolean;
    };
  };
  categories?: {
    orderBy?: string;
    order?: Array<string>;
  };
}

export const defaultSettings: TAppSettings = {
  dateFormat: 'DD/MM/YYYY',
  screenDefault: 'home',
  hideBalance: false,
  notification: {
    enabled: true,
    sound: true,
    time: '08:00',
  },
  theme: {
    auto: true,
    darkMode: false,
    color: COLOR_SCHEME.modernBlue,
    bottomBarType: 'flat',
  },
  report: {
    startDayOfWeek: 0, // Chủ nhật
    startDateOfMonth: 1, // Ngày đầu tháng
    startMonthOfYear: 0, // Tháng 1
  },
  security: {
    pinCode: '',
    biometricEnabled: false,
  },
  accounts: {
    sortByName: true,
    sortOrder: [],
    sortOrderInGroup: [],
    groupByType: false,
    isViewActive: true,
  },
  transactions: {
    display: {
      income: true,
      expense: true,
      amount: true,
      description: true,
    },
  },
  categories: {
    orderBy: 'name',
    order: [],
  },
};

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
   * @returns Trả về một phần của TAppSettings hoặc null nếu không có thiết lập nào.
   */
  public async getSettingStatus(path?: string): Promise<Partial<TAppSettings> | null> {
    const settingPath = path ? `${FB_PATH.SETTINGS}/${path}` : FB_PATH.SETTINGS;
    const { data, error } = await databaseService.get<TAppSettings>(settingPath);

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
    newSettings: Partial<TAppSettings>;
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
