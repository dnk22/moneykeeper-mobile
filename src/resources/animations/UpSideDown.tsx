import React, { ReactElement } from 'react';
import { Animated, Easing } from 'react-native';

const UpSideDownAnimated = ({
  children,
  isChange,
}: {
  children: ReactElement;
  isChange: boolean;
}) => {
  const upSideDown = new Animated.Value(isChange ? 1 : 0);

  const rotate = upSideDown.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  if (isChange) {
    Animated.timing(upSideDown, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ rotateX: rotate }] }}>
      {children}
    </Animated.View>
  );
};
export default UpSideDownAnimated;
