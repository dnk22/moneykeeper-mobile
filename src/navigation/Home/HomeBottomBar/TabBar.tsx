import React from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styles from './styles';
import PressableHaptic from 'components/PressableHaptic';
import { RNText } from 'components/index';

type ITabBarProps = {
  active?: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  style: any;
};

const TabBar = ({ active, options, onPress, style }: ITabBarProps) => {
  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0.5, { duration: 400 }),
      transform: [{ scale: withTiming(active ? 1.2 : 1) }],
      marginBottom: 3,
    };
  });

  return (
    <PressableHaptic onPress={onPress} disabled={active} style={[styles.component, style]}>
      <Animated.View style={animatedIconContainerStyles}>
        {/* @ts-ignore */}
        {options.tabBarIcon()}
      </Animated.View>
      {options.tabBarLabel && <RNText preset="textXXSmall">{options.tabBarLabel}</RNText>}
    </PressableHaptic>
  );
};

export default TabBar;
