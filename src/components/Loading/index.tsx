import React, { memo } from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorIOSProps,
  ColorValue,
} from 'react-native';
import isEqual from 'react-fast-compare';

interface ILoadingProps extends ActivityIndicatorIOSProps {
  size?: 'small' | 'large' | undefined;
  color?: ColorValue | undefined;
}

function Loading({
  size = 'small',
  color = '#2D31FA',
  ...rest
}: ILoadingProps) {
  return <ActivityIndicator size={size} color={color} {...rest} />;
}

export default memo(Loading, isEqual);
