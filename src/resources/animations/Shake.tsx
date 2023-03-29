import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type ShakeAnimationProps = {
  isActiveAnim: boolean;
  children: React.ReactNode;
};
function ShakeAnimation({ isActiveAnim = false, children }: ShakeAnimationProps) {
  const shakeAnim = useRef(new Animated.Value(1));

  useEffect(() => {
    if (isActiveAnim) {
      startShake().start();
    } else {
      startShake().stop();
      shakeAnim.current.setValue(1);
    }
  }, [isActiveAnim]);

  const startShake = () =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim.current, { toValue: 0.9, duration: 300, useNativeDriver: true }),
        Animated.timing(shakeAnim.current, { toValue: 1.1, duration: 300, useNativeDriver: true }),
      ]),
    );

  return (
    <Animated.View style={{ transform: [{ scale: shakeAnim.current }] }}>{children}</Animated.View>
  );
}

export default ShakeAnimation;
