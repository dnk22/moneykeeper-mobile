import React from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from 'components/Text';
import styles from './styles';
import { CustomTheme } from 'resources/theme';

type TabBarProps = {
  active: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  colors: CustomTheme['colors'];
  style?: object;
};

const TabBar = ({ active, options, onPress, colors, style }: TabBarProps) => {
  const colorsWithOpacity = colors.text + '90';
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active ? 1.2 : 1, { duration: 300 }) }],
  }));

  return (
    <Pressable onPress={onPress}>
      <View style={styles.component}>
        <Animated.View style={[styles.icon, animatedIconStyle, style]}>
          {options.tabBarIcon &&
            options.tabBarIcon({
              focused: active,
              color: active ? colors.primary : colorsWithOpacity,
              size: 24,
            })}
        </Animated.View>
        {options.tabBarLabel && (
          <Text fontSize={active ? 10 : 8} color={active ? colors.primary : colorsWithOpacity}>
            {options.tabBarLabel}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default React.memo(TabBar);
