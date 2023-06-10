import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styles from './styles';
import Text from 'components/Text';

type ITabBarProps = {
  active?: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  colors: any;
  style: any;
};

const TabBar = ({ active, options, onPress, colors, style }: ITabBarProps) => {
  const animatedComponentCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(active ? 1 : 0, { duration: 500 }),
        },
      ],
    };
  });

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(active ? 1.2 : 1, { duration: 400 }),
        },
      ],
      opacity: withTiming(active ? 1 : 0.5, { duration: 400 }),
    };
  });

  return (
    <Pressable onPress={onPress}>
      <View style={styles.component}>
        <Animated.View
          style={[
            styles.itemActive,
            animatedComponentCircleStyles,
            { backgroundColor: colors.primary },
          ]}
        />
        <Animated.View style={[styles.icon, animatedIconContainerStyles, style]}>
          {/* @ts-ignore */}
          {options.tabBarIcon({ color: !style ? colors.primary : 'white' })}
        </Animated.View>
        <Text fontSize={10}>{options?.tabBarLabel}</Text>
      </View>
    </Pressable>
  );
};

export default TabBar;
