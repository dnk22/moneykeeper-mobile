import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from 'resources/theme';
import TabBar from './TabBar';
import styles from './styles';
import isEqual from 'react-fast-compare';

const HomeBottomBarSticky = ({
  state: { index: activeIndex, routes },
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const { colors } = useCustomTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBarContainer, { paddingBottom: bottom / 2 }]}>
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        {routes.map((route, index) => {
          const isFocused = index === activeIndex;
          const { options } = descriptors[route.key];
          const isCircle =
            index === 2
              ? [
                  styles.circle,
                  {
                    backgroundColor: colors.primary,
                  },
                ]
              : undefined;

          const navigate = useCallback(() => {
            if (!isFocused) navigation.navigate(route.name);
          }, [isFocused, navigation]);

          return (
            <TabBar
              key={route.key}
              isFocused={isFocused}
              options={options}
              onPress={navigate}
              style={isCircle}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
};

export default memo(HomeBottomBarSticky, isEqual);
