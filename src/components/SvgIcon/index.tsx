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

function SvgIcon({ name, color, size, preset = 'default', ...rest }: SvgIconProps) {
  const { colors } = useCustomTheme();

  // import svg icon by name
  const Icon: React.FC<SvgProps> = (name && SVG[name]) || SVG.questionCircle;
  const presetStyle = IconSize[preset];

  const dimension = {
    width: size ? normalize(size) : presetStyle,
    height: size ? normalize(size) : presetStyle,
  };
  return (
    <Icon
      width={dimension.width}
      height={dimension.height}
      color={color || colors.text}
      {...rest}
    />
  );
}

export default memo(SvgIcon, isEqual);
