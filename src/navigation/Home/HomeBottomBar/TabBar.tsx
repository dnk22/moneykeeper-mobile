import { memo } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styles from './styles';
import PressableHaptic from 'components/PressableHaptic';
import { RNText } from 'components/index';
import isEqual from 'react-fast-compare';

type ITabBarProps = {
  isFocused?: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  style: any;
};

const TabBar = ({ isFocused, options, onPress, style }: ITabBarProps) => {
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
        {options.tabBarIcon()}
      </Animated.View>
      {options.tabBarLabel && <RNText preset="textXXSmall">{options.tabBarLabel}</RNText>}
    </PressableHaptic>
  );
};

export default memo(TabBar, isEqual);
