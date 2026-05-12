import { RefObject } from 'react';
import { TextInput } from 'react-native';

export type CustomKeyboardType = 'calculator';

export type ActiveKeyboardInput = {
  id: string;
  name: string;
  value: string;
  onChange: (nextValue: string) => void;
  inputRef?: RefObject<TextInput | null>;
  keyboardType: CustomKeyboardType;
  replaceOnFirstKeyPress: boolean;
  hasPressedKeySinceFocus: boolean;
  onDone?: () => void;
  onDismiss?: () => void;
};

export type ShowKeyboardPayload = {
  id: string;
  name: string;
  value: string | number;
  onChange: (nextValue: string) => void;
  inputRef?: RefObject<TextInput | null>;
  keyboardType?: CustomKeyboardType;
  replaceOnFirstKeyPress?: boolean;
  onDone?: () => void;
  onDismiss?: () => void;
};

export type CustomKeyboardContextValue = {
  isVisible: boolean;
  height: number;
  activeInput: ActiveKeyboardInput | null;
  showKeyboard: (payload: ShowKeyboardPayload) => void;
  hideKeyboard: (options?: { blurInput?: boolean; triggerDismiss?: boolean }) => void;
  setActiveValue: (value: string) => void;
  markFirstKeyPressed: () => void;
  setKeyboardHeight: (height: number) => void;
};
