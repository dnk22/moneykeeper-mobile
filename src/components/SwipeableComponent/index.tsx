import { useRef } from 'react';
import { Animated, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import TrashIcon from 'assets/svg/icon-trash.svg';
import styles from './styles';
import { SwipeableProps } from 'react-native-gesture-handler/lib/typescript/components/Swipeable';

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
  const swipeableRef = useRef(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<any>,
    dragX: Animated.AnimatedInterpolation<any>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={{ width: 80 }}>
        <RectButton style={styles.rightAction} onPress={close}>
          <AnimatedView style={{ transform: [{ scale }] }}>
            <TrashIcon color={'white'} />
          </AnimatedView>
        </RectButton>
      </View>
    );
  };

  const close = () => {
    swipeableRef.current?.close();
    onDelete && onDelete();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      // enableTrackpadTwoFingerGesture
      renderRightActions={renderRightActions}
      onSwipeableClose={onSwipeableClose}
      {...rest}
    >
      {children}
    </Swipeable>
  );
}

export default SwipeableComponent;
