import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import { normalize } from 'share/dimensions';
import FastImage, { FastImageProps } from '@d11/react-native-fast-image';
import imgSrc from './data';

const unknownIcon = require('assets/images/default/unknown.png');

interface IconComponentProps extends FastImageProps {
  name?: keyof typeof imgSrc | string;
  color?: string;
  size?: number;
  useTheme?: boolean;
  style?: any;
  defaultIcon?: string | { uri: string };
}

function ImageComponent({
  name,
  color,
  size = 26,
  resizeMode = 'contain',
  useTheme = false,
  style,
  defaultIcon,
  ...rest
}: IconComponentProps) {
  const { colors } = useCustomTheme();
  const theme = useTheme ? colors.text : undefined;
  const responsiveSize = normalize(size);
  const imgSource = typeof name === 'string' ? { uri: name } : name;
  const img =
    name && imgSrc[name as keyof typeof imgSrc] ? imgSrc[name as keyof typeof imgSrc] : imgSource;

  return (
    <FastImage
      {...rest}
      defaultSource={defaultIcon || unknownIcon}
      style={{ width: responsiveSize, height: responsiveSize, ...style }}
      tintColor={theme}
      resizeMode={resizeMode}
      source={img}
    />
  );
}

export default memo(ImageComponent, isEqual);
