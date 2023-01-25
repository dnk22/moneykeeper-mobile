import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Animated, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import TrashIcon from 'assets/svg/icon-trash.svg';
import styles from './styles';
import { SwipeableProps } from 'react-native-gesture-handler/lib/typescript/components/Swipeable';
import { useCustomTheme } from '/resources/theme';

interface ISwipeableComponentProps extends SwipeableProps {
  children: React.ReactNode;
}
const AnimatedView = Animated.createAnimatedComponent(View);

function SwipeableComponent({
  children,
  onSwipeableClose,
  ...rest
}: ISwipeableComponentProps) {
  const { colors } = useCustomTheme();
  const swipeableRef = useRef(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<any>,
    dragX: Animated.AnimatedInterpolation<any>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton
        style={[styles.rightAction, { backgroundColor: colors.error }]}
      >
        <AnimatedView style={[styles.actionIcon, { transform: [{ scale }] }]}>
          <TrashIcon color={'white'} />
        </AnimatedView>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootFriction={8}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      onSwipeableClose={onSwipeableClose}
      {...rest}
    >
      {children}
    </Swipeable>
  );
}

export default memo(SwipeableComponent, isEqual);
