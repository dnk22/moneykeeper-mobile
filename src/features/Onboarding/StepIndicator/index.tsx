import { useEffect } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { styles } from './styles';

function StepIndicator({ step, steps }: { step: number; steps: Array<{ key: string }> }) {
  const { colors } = useCustomTheme();
  const currentStep = useSharedValue(0);

  useEffect(() => {
    currentStep.value = step;
  }, [step]);

  return (
    <View style={styles.container}>
      {steps.map((item, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const isActive = currentStep.value === index;
          return {
            width: withTiming(isActive ? 32 : 8, {
              duration: 500,
              easing: Easing.inOut(Easing.ease),
            }),
            opacity: withTiming(isActive ? 1 : 0.4, {
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            }),
          };
        });
        return (
          <Animated.View
            key={item.key}
            style={[
              styles.step,
              { backgroundColor: step === index ? colors.primary : colors.primaryVariant },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
}

export default StepIndicator;
