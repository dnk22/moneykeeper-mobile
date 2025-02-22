import React, { memo, useMemo } from 'react';
import { Pressable, PressableProps, GestureResponderEvent } from 'react-native';
import isEqual from 'react-fast-compare';
import { hapticFeedback } from 'utils/system';

export interface IPressableHapticProps extends PressableProps {
  children: React.ReactNode;
  useHaptic?: boolean;
}

const PressableHaptic = ({
  children,
  useHaptic = true,
  onPress,
  ...rest
}: IPressableHapticProps) => {
  const onHandlePress = useMemo(
    () => (event: GestureResponderEvent) => {
      if (useHaptic) hapticFeedback();
      onPress?.(event);
    },
    [useHaptic, onPress],
  );

  return (
    <Pressable {...rest} onPress={onHandlePress}>
      {children}
    </Pressable>
  );
};

export default memo(PressableHaptic, isEqual);
