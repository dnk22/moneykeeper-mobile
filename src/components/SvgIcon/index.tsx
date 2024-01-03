import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { SvgProps } from 'react-native-svg';
import { useCustomTheme } from 'resources/theme';
import { normalize } from 'share/dimensions';
import * as SVG from 'assets/svg';
import { IconSize } from './preset';

interface SvgIconProps extends SvgProps {
  name?: keyof typeof SVG;
  color?: string;
  preset?: keyof typeof IconSize;
  size?: number;
}

function SvgIcon({ name, color, size = 24, preset = 'default', ...rest }: SvgIconProps) {
  const { colors } = useCustomTheme();

  // import svg icon by name
  const Icon: React.FC<SvgProps> = (name && SVG[name]) || SVG.questionCircle;

  return (
    <Icon width={normalize(size)} height={normalize(size)} color={color || colors.text} {...rest} />
  );
}

export default memo(SvgIcon, isEqual);
