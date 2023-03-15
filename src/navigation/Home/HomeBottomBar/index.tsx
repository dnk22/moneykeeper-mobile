import { memo } from 'react';
import { View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from 'resources/theme';
import TabBar from './TabBar';
import styles from './styles';
import isEqual from 'react-fast-compare';

type BottomBarProps = BottomTabBarProps & { circle: string };
const BottomBar = ({
  state: { index: activeIndex, routes },
  navigation,
  descriptors,
  circle,
}: BottomBarProps) => {
  const { colors } = useCustomTheme();
  const { bottom: bottomSafeAreaHeight } = useSafeAreaInsets();
  const circleStyle = [
    styles.circle,
    {
      backgroundColor: colors.primary,
    },
  ];

  return (
    <View
      style={[
        styles.bottomBarContainer,
        {
          paddingBottom: bottomSafeAreaHeight / 2,
        },
      ]}
    >
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        {routes.map((route, index) => {
          const isFocused = index === activeIndex;
          const { options } = descriptors[route.key];
          const isTransactions = route.name === circle ? circleStyle : '';
          const navigate = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TabBar
              key={route.key}
              isFocused={isFocused}
              options={options}
              onPress={navigate}
              style={isTransactions}
            />
          );
        })}
      </View>
    </View>
  );
};

export default memo(BottomBar, isEqual);
