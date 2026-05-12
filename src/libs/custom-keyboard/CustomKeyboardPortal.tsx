import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Portal } from '@gorhom/portal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KeyboardCalculator from 'components/InputCalculator/KeyboardCalculator';
import { useCustomKeyboard } from './useCustomKeyboard';
import { useCustomTheme } from 'resources/theme';

export function CustomKeyboardPortal() {
  const { colors } = useCustomTheme();
  const insets = useSafeAreaInsets();
  const {
    activeInput,
    isVisible,
    hideKeyboard,
    setActiveValue,
    markFirstKeyPressed,
    setKeyboardHeight,
    height,
  } = useCustomKeyboard();
  const translateY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 500,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isVisible, translateY]);

  const shouldReplaceOnFirstKeyPress = useMemo(() => {
    if (!activeInput) {
      return false;
    }

    return activeInput.replaceOnFirstKeyPress && !activeInput.hasPressedKeySinceFocus;
  }, [activeInput]);

  const onKeyboardLayout = (event: LayoutChangeEvent) => {
    setKeyboardHeight(event.nativeEvent.layout.height + insets.bottom);
  };

  if (!activeInput) {
    return null;
  }

  return (
    <Portal>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <Pressable
          style={[styles.backdrop, { bottom: height }]}
          onPress={() => hideKeyboard({ blurInput: true, triggerDismiss: true })}
        />
        <Animated.View
          pointerEvents="auto"
          onLayout={onKeyboardLayout}
          style={[
            styles.keyboardContainer,
            {
              transform: [{ translateY }],
              backgroundColor: colors.background,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 10,
            },
          ]}
        >
          <KeyboardCalculator
            value={activeInput.value}
            colors={colors}
            replaceOnFirstKeyPress={shouldReplaceOnFirstKeyPress}
            onFirstKeyPressHandled={markFirstKeyPressed}
            onChange={setActiveValue}
            onDone={() => {
              activeInput.onDone?.();
              hideKeyboard({ blurInput: true, triggerDismiss: false });
            }}
          />
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
});
