import Toast, { ToastShowParams } from 'react-native-toast-message';
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Hàm gọi phản hồi xúc giác
export const hapticFeedback = (type: HapticFeedbackTypes = HapticFeedbackTypes.selection) => {
  ReactNativeHapticFeedback.trigger(type, hapticOptions);
};

// Hàm hiển thị toast
export function showToast({
  type,
  text1,
  text2,
  position = 'top',
  visibilityTime = 1500,
  autoHide = true,
  ...rest
}: ToastShowParams) {
  if (type === 'success') hapticFeedback(HapticFeedbackTypes.notificationSuccess);
  else if (type === 'error') hapticFeedback(HapticFeedbackTypes.notificationError);
  else hapticFeedback();

  Toast.show({
    type,
    topOffset: 42,
    text1: text1 || (type === 'error' ? 'Lỗi!' : 'Thành công!'),
    text2,
    position,
    visibilityTime,
    autoHide,
    ...rest,
  });
}
