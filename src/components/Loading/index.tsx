import { ActivityIndicator, ActivityIndicatorIOSProps, ColorValue } from 'react-native';

interface ILoadingProps extends ActivityIndicatorIOSProps {
  size?: 'small' | 'large' | undefined;
  color?: ColorValue | undefined;
}

function Loading({ size = 'small', color = '#2D31FA', ...rest }: ILoadingProps) {
  return <ActivityIndicator size={size} color={color} {...rest} style={{ flex: 1 }} />;
}

export default Loading;
