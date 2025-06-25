import React from 'react';
import { ActivityIndicator, ActivityIndicatorIOSProps, ColorValue, View } from 'react-native';
import { CustomTheme } from 'resources/theme';
import styles from './styles';

interface ILoadingProps extends ActivityIndicatorIOSProps {
  size?: 'small' | 'large' | undefined;
  color?: ColorValue | undefined;
}

function Loading({ size = 'small', color = '#2D31FA', ...rest }: ILoadingProps) {
  return <ActivityIndicator size={size} color={color} {...rest} />;
}

function LoadingContainer({ theme, darkMode }: { theme?: CustomTheme; darkMode?: boolean }) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' },
      ]}
    >
      <View
        style={[styles.loadingIndicator, { backgroundColor: theme?.colors.surface || 'white' }]}
      >
        <Loading size="large" />
      </View>
    </View>
  );
}

export default Loading;
export { LoadingContainer as LoadingIndicatorContainer };
