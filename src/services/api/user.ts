import { userService } from 'services/firebase/services/user';
import { TResponse } from 'utils/types/request.type';

export async function markUserAsOnboarded(): Promise<TResponse> {
  try {
    await userService.markUserAsOnboarded();
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
