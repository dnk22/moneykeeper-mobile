import { useRef, useCallback } from 'react';
import { Animated, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { SwipeableProps } from 'react-native-gesture-handler/lib/typescript/components/Swipeable';
import { BagCross } from 'iconsax-react-native';
import styles from './styles';

interface ISwipeableComponentProps extends SwipeableProps {
  children: React.ReactNode;
  onDelete?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function SwipeableComponent({
  children,
  onSwipeableClose,
  onDelete,
  ...rest
}: ISwipeableComponentProps) {
  const swipeableRef = useRef<Swipeable | null>(null);

  const close = useCallback(() => {
    swipeableRef.current?.close();
    onDelete?.();
  }, [onDelete]);

  const renderRightActions = useCallback(
    (
      _progress: Animated.AnimatedInterpolation<any>,
      dragX: Animated.AnimatedInterpolation<any>,
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      return (
        <View style={{ width: 80, zIndex: 1 }}>
          <RectButton style={styles.rightAction} onPress={close}>
            <AnimatedView style={{ transform: [{ scale }] }}>
              <BagCross size="32" color="#FF8A65" />
            </AnimatedView>
          </RectButton>
        </View>
      );
    },
    [close],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      onSwipeableClose={onSwipeableClose}
      {...rest}
    >
      {children}
    </Swipeable>
  );
}

export default SwipeableComponent;
