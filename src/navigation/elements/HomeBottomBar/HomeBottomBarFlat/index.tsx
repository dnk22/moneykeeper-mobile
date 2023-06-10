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

  const circleStyle = [
    styles.circle,
    {
      backgroundColor: colors.primary,
    },
  ];
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
          const isTransactions = index === 2 ? circleStyle : '';
          const navigate = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!active && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TabBar
              key={route.key}
              active={active}
              options={options}
              colors={colors}
              style={isTransactions}
              onPress={navigate}
            />
          );
        })}
      </View>
    </View>
  );
};

export default memo(HomeBottomBarFlat, isEqual);
