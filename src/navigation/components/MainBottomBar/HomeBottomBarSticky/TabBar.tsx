import { memo } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PressableHaptic from 'components/PressableHaptic';
import isEqual from 'react-fast-compare';
import RNText from 'components/Text';
import styles from './styles';

type ITabBarProps = {
  isFocused?: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  style: any;
  colors: any;
};

const TabBar = ({ isFocused, options, onPress, style, colors }: ITabBarProps) => {
  const colorsWithOpacity = colors.text + '90';

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0.5, { duration: 400 }),
      transform: [{ scale: withTiming(isFocused ? 1.2 : 1) }],
      marginBottom: 3,
    };
  });

  return (
    <PressableHaptic onPress={onPress} style={[styles.component, style]}>
      <Animated.View style={animatedIconContainerStyles}>
        {/* @ts-ignore */}
        {options.tabBarIcon({ color: isFocused ? colors.primary : colorsWithOpacity })}
      </Animated.View>
      {options.tabBarLabel && (
        <RNText
          fontSize={isFocused ? 10 : 8}
          color={isFocused ? colors.primary : colorsWithOpacity}
        >
          {options.tabBarLabel}
        </RNText>
      )}
    </PressableHaptic>
  );
};

export default memo(TabBar, isEqual);
