import { useContext } from 'react';
import { CustomKeyboardContext } from './CustomKeyboardProvider';

export function useCustomKeyboard() {
  const context = useContext(CustomKeyboardContext);

  if (!context) {
    throw new Error('useCustomKeyboard must be used within CustomKeyboardProvider');
  }

  return context;
}

export function useCustomKeyboardInsets() {
  const { isVisible, height } = useCustomKeyboard();

  return {
    isVisible,
    keyboardHeight: isVisible ? height : 0,
  };
}
