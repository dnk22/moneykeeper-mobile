import { appSettingsFb } from 'services/firebase/db/appSettings';
import { TResponse } from 'utils/types/request.type';

export async function updateOnboardingSettings(payload: any): Promise<TResponse> {
  try {
    await appSettingsFb.updateSettings({ newSettings: payload });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
