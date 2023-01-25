import React, { memo } from 'react';
import {
  Pressable,
  PressableProps,
  View,
  GestureResponderEvent,
} from 'react-native';
import isEqual from 'react-fast-compare';
import { hapticFeedback } from '/utils/system/haptic';

type baseType = PressableProps & React.RefAttributes<View>;

export interface IPressableHapticProps extends baseType {
  children: React.ReactNode;
  useHaptic?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}
function PressableHaptic({
  children,
  useHaptic = true,
  onPress,
  ...rest
}: IPressableHapticProps) {
  const onHandlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event);
    }
    if (useHaptic) {
      hapticFeedback();
    }
  };
  return (
    <Pressable {...rest} onPress={onHandlePress}>
      {children}
    </Pressable>
  );
}

export default memo(PressableHaptic, isEqual);
