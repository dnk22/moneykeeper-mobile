import React, { memo, useEffect, useMemo, useState } from 'react';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import SegmentedControl from 'components/SegmentedControl';
import { SAVINGS, WALLET } from 'navigation/constants';
import styles from '../styles';

function TabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
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
      />
    </View>
  );
}
export default memo(TabBar, isEqual);
