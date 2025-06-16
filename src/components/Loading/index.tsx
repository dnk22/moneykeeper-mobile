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

function LoadingContainer({ theme }: { theme?: CustomTheme }) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.loadingIndicator,
          { backgroundColor: theme ? theme.colors.background : 'white' },
        ]}
      >
        <Loading />
      </View>
    </View>
  );
}

export default Loading;
export { LoadingContainer as LoadingIndicatorContainer };
