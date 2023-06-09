import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import TabBar from './TabBar';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

const HomeBottomBarFlat = ({
  state: { index: activeIndex, routes },
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const { colors } = useCustomTheme();
  const { bottom: bottomSafeAreaHeight } = useSafeAreaInsets();
  const marginBottom = Platform.OS === 'ios' ? bottomSafeAreaHeight : 0;
  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: marginBottom,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const active = index === activeIndex;
          const { options } = descriptors[route.key];
          return (
            <TabBar
              key={route.key}
              active={active}
              options={options}
              colors={colors}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default memo(HomeBottomBarFlat, isEqual);
