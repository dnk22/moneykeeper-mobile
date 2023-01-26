import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { NumberProp, SvgProps } from 'react-native-svg';
import { useCustomTheme } from 'resources/theme';
import { normalize } from 'share/dimensions';
import icon, { IconProps } from './const';
import { IconSize } from './preset';

interface SvgIconProps extends SvgProps {
  name: IconProps;
  color?: string;
  preset?: keyof typeof IconSize;
  size?: NumberProp;
}

function SvgIcon({ name, color, size, preset = 'default', ...rest }: SvgIconProps) {
  const { colors } = useCustomTheme();
  // import svg icon by name
  const Icon: React.FC<SvgProps> = icon[name] || icon.questionCircle;
  const presetStyle = IconSize[preset];
  const dimension = {
    width: normalize(size) || presetStyle,
    height: normalize(size) || presetStyle,
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
