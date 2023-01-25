import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const hapticFeedback = (type?: HapticFeedbackTypes) => {
  ReactNativeHapticFeedback.trigger(type || 'selection', options);
};
