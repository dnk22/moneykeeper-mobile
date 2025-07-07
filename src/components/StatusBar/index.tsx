import { StatusBar as RNStatusBar, StatusBarProps } from 'react-native';

type StatusBar = StatusBarProps & {};

function StatusBar({ barStyle = 'light-content', ...rest }: StatusBar) {
  return <RNStatusBar barStyle={barStyle} {...rest} />;
}
export default StatusBar;
