import { memo, useCallback } from 'react';
import { Platform, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from './TabBar';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

const HomeBottomBarFlat = ({
  state: { index: activeIndex, routes },
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const { colors } = useCustomTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: Platform.OS === 'ios' ? bottom : 0,
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
        },
      ]}
    >
      <View style={styles.tabBarContainer}>
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
              active={isFocused}
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

export default memo(HomeBottomBarFlat, isEqual);
