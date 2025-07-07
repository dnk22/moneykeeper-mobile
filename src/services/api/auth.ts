import { appSettingsService } from 'services/firebase/services/appSettings';
import { TResponse } from 'utils/types/request.type';

export async function updateOnboardingSettings(payload: any): Promise<TResponse> {
  try {
    await appSettingsService.updateSettings({ newSettings: payload });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
