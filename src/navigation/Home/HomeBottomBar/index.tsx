import React, { useCallback } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import TabBar from './TabBar';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

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

  const navigate = useCallback((route: string) => {
    navigation.navigate(route);
  }, []);

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
          const active = index === activeIndex;
          const { options } = descriptors[route.key];
          const isTransactions = route.name === circle ? circleStyle : '';
          return (
            <TabBar
              key={route.key}
              active={active}
              options={options}
              onPress={() => navigate(route.name)}
              style={isTransactions}
            />
          );
        })}
      </View>
    </View>
  );
};

export default BottomBar;
