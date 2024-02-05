import Toast, { ToastProps } from 'react-native-toast-message';
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const hapticFeedback = (type?: HapticFeedbackTypes) => {
  ReactNativeHapticFeedback.trigger(type || 'selection', options);
};

export function showToast({ type, text2, ...rest }: ToastProps) {
  Toast.show({
    type,
    topOffset: 60,
    text1: type === 'error' ? 'Oops! Lỗi mất rồi.' : 'Thành công!',
    text2,
    visibilityTime: 2000,
    ...rest,
  });
}
