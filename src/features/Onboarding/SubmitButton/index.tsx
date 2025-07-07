import { useEffect } from 'react';
import { useCustomTheme } from 'resources/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { styles } from './styles';
import PressableHaptic from 'components/PressableHaptic';
import { ArrowRight } from 'iconsax-react-native';
import Text from 'components/Text';

function SubmitButton({
  step,
  isLastStep,
  onPress,
}: {
  step: number;
  onPress: () => void;
  isLastStep: boolean;
}) {
  const { colors } = useCustomTheme();
  const currentStep = useSharedValue(0);

  useEffect(() => {
    currentStep.value = step;
  }, [step]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(!currentStep.value || isLastStep ? 160 : 58, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  return (
    <PressableHaptic onPress={onPress}>
      <Animated.View style={[styles.submitBtn, { backgroundColor: colors.primary }, animatedStyle]}>
        {isLastStep ? (
          <Text color="white">Xác nhận</Text>
        ) : step ? (
          <ArrowRight color="white" />
        ) : (
          <Text color="white">Khám phá ngay</Text>
        )}
      </Animated.View>
    </PressableHaptic>
  );
}

export default SubmitButton;
