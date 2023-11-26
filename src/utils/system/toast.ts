import Toast, { ToastProps } from 'react-native-toast-message';

export default function showToast({ type, ...rest }: ToastProps) {
  Toast.show({
    type,
    topOffset: 60,
    text1: type === 'error' ? 'Oops! Lỗi mất rồi.' : 'Thành công!',
    ...rest,
  });
}
