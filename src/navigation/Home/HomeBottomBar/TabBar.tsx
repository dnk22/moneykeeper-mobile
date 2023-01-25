import React from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styles from './styles';

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
    };
  });

  return (
    <Pressable onPress={onPress} disabled={active} style={[styles.component, style]}>
      <Animated.View style={animatedIconContainerStyles}>
        {/* @ts-ignore */}
        {options.tabBarIcon()}
      </Animated.View>
    </Pressable>
  );
};

export default TabBar;
