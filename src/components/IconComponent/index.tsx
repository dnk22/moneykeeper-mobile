import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import * as bankIcon from 'assets/images/banks';
import * as transactionCategoryIcon from 'assets/images/transactionCategory';
import * as transactionTypeIcon from 'assets/images/transactionType';
const transferUp = require('assets/images/transactionCategory/transferUp.png')
const transferDown = require('assets/images/transactionCategory/transferDown.png')
import * as commonIcon from 'assets/images/common';
import { normalize } from 'share/dimensions';
import { Image, ImageProps } from 'react-native';

const imgSrc = {
  ...bankIcon,
  ...transactionCategoryIcon,
  ...transactionTypeIcon,
  ...commonIcon,
  transferDown,
  transferUp,
};

interface IconComponentProps extends ImageProps {
  name?: keyof typeof imgSrc;
  color?: string;
  size?: number;
  useTheme?: boolean;
  style?: any;
  source?: any;
}

function IconComponent({
  name,
  color,
  size = 26,
  resizeMode = 'contain',
  useTheme = false,
  style,
  ...rest
}: IconComponentProps) {
  const { colors } = useCustomTheme();
  const theme = useTheme ? colors.text : undefined;
  const responsiveSize = normalize(size);

  return (
    <Image
      {...rest}
      style={{ width: responsiveSize, height: responsiveSize, ...style }}
      tintColor={theme}
      resizeMode={resizeMode}
      source={imgSrc[name]}
    />
  );
}

export default memo(IconComponent, isEqual);
