import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View, StatusBar as RNStatusBar, StatusBarProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from 'resources/theme';

type StatusBar = StatusBarProps & {
  color?: string;
};

function StatusBar({ barStyle = 'light-content', color }: StatusBar) {
  const { top: topSafeAreaHeight } = useSafeAreaInsets();
  const { colors } = useCustomTheme();
  return (
    <>
      <RNStatusBar barStyle={barStyle} />
      <View style={{ height: topSafeAreaHeight, backgroundColor: color || colors.primary }} />
    </>
  );
}
export default memo(StatusBar, isEqual);
