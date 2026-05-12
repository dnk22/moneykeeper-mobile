import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { BackHandler, Keyboard } from 'react-native';
import type {
  ActiveKeyboardInput,
  CustomKeyboardContextValue,
  ShowKeyboardPayload,
} from './types';

export const CustomKeyboardContext = createContext<CustomKeyboardContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_KEYBOARD_HEIGHT = 280;
const CLOSE_ANIMATION_MS = 220;

export function CustomKeyboardProvider({ children }: Props) {
  const [activeInput, setActiveInput] = useState<ActiveKeyboardInput | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(DEFAULT_KEYBOARD_HEIGHT);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeInputRef = useRef<ActiveKeyboardInput | null>(null);

  const showKeyboard = useCallback((payload: ShowKeyboardPayload) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const normalizedValue = payload.value === null || payload.value === undefined ? '' : String(payload.value);

    setActiveInput({
      id: payload.id,
      name: payload.name,
      value: normalizedValue,
      onChange: payload.onChange,
      inputRef: payload.inputRef,
      keyboardType: payload.keyboardType ?? 'calculator',
      replaceOnFirstKeyPress: payload.replaceOnFirstKeyPress ?? true,
      hasPressedKeySinceFocus: false,
      onDone: payload.onDone,
      onDismiss: payload.onDismiss,
    });

    setIsVisible(true);
  }, []);

  const hideKeyboard = useCallback(
    (options?: { blurInput?: boolean; triggerDismiss?: boolean }) => {
      const currentActiveInput = activeInputRef.current;
      const shouldBlur = options?.blurInput ?? true;
      const shouldTriggerDismiss = options?.triggerDismiss ?? true;

      if (shouldTriggerDismiss) {
        currentActiveInput?.onDismiss?.();
      }

      if (shouldBlur) {
        currentActiveInput?.inputRef?.current?.blur();
      }

      setIsVisible(false);
      const closingInputId = currentActiveInput?.id;

      closeTimeoutRef.current = setTimeout(() => {
        setActiveInput((current) => (current?.id === closingInputId ? null : current));
        closeTimeoutRef.current = null;
      }, CLOSE_ANIMATION_MS);
    },
    [],
  );

  const setActiveValue = useCallback((value: string) => {
    setActiveInput((prev) => {
      if (!prev) {
        return prev;
      }

      prev.onChange(value);

      return {
        ...prev,
        value,
      };
    });
  }, []);

  const markFirstKeyPressed = useCallback(() => {
    setActiveInput((prev) => {
      if (!prev || prev.hasPressedKeySinceFocus) {
        return prev;
      }

      return {
        ...prev,
        hasPressedKeySinceFocus: true,
      };
    });
  }, []);

  const setKeyboardHeight = useCallback((nextHeight: number) => {
    setHeight(nextHeight || DEFAULT_KEYBOARD_HEIGHT);
  }, []);

  React.useEffect(() => {
    activeInputRef.current = activeInput;
  }, [activeInput]);

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      hideKeyboard({ blurInput: true, triggerDismiss: true });
      return true;
    });

    return () => subscription.remove();
  }, [hideKeyboard, isVisible]);

  React.useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      if (isVisible) {
        hideKeyboard({ blurInput: false, triggerDismiss: true });
      }
    });

    return () => subscription.remove();
  }, [hideKeyboard, isVisible]);

  React.useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  const value = useMemo<CustomKeyboardContextValue>(
    () => ({
      isVisible,
      height,
      activeInput,
      showKeyboard,
      hideKeyboard,
      setActiveValue,
      markFirstKeyPressed,
      setKeyboardHeight,
    }),
    [activeInput, height, hideKeyboard, isVisible, markFirstKeyPressed, setActiveValue, setKeyboardHeight, showKeyboard],
  );

  return <CustomKeyboardContext.Provider value={value}>{children}</CustomKeyboardContext.Provider>;
}
