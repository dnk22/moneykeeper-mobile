import { StatusBar as RNStatusBar, StatusBarProps } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useCustomTheme } from 'resources/theme';

type StatusBar = StatusBarProps & {};

function StatusBar({ barStyle = 'light-content', ...rest }: StatusBar) {
  return <RNStatusBar barStyle={barStyle} {...rest} />;
}
export default StatusBar;
