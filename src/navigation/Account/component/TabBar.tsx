import React, { memo, useEffect, useMemo, useState } from 'react';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import styles from '../styles';
import { useCustomTheme } from 'resources/theme';
import SegmentedControl from 'components/SegmentedControl';
import { SAVINGS, WALLET } from 'navigation/constants';

function TabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  const { colors } = useCustomTheme();
  const [isActive, setIsActive] = useState(state.index);

  const routes = useMemo(() => {
    return state.routes.map((route) => {
      const { options } = descriptors[route.key];
      return options.title;
    });
  }, []);

  useEffect(() => {
    setIsActive(state.index);
  }, [state]);

  const onRouteChange = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate(WALLET);
        break;
      default:
        navigation.navigate(SAVINGS);
        break;
    }
    setIsActive(index);
  };

  return (
    <View style={styles.tabBarContainer}>
      <SegmentedControl
        values={routes}
        selectedIndex={isActive}
        onChange={onRouteChange}
        tintColor={colors.primary}
        activeFontStyle={{ color: 'white' }}
      />
    </View>
  );
}
export default memo(TabBar, isEqual);
