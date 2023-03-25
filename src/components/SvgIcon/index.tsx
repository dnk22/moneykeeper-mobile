import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import FastImage from 'react-native-fast-image';
import { NumberProp, SvgProps } from 'react-native-svg';
import { Image } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { normalize } from 'share/dimensions';
import icon, { IconProps } from './const';
import { IconSize } from './preset';
import { imagesPath } from 'assets/images';

const imgSrc = imagesPath;

interface SvgIconProps extends SvgProps {
  name?: IconProps;
  color?: string;
  preset?: keyof typeof IconSize;
  size?: NumberProp;
}

function SvgIcon({ name, color, size, preset = 'default', ...rest }: SvgIconProps) {
  const { colors } = useCustomTheme();
  const isImage = useMemo(() => name && !icon.hasOwnProperty(name), [name]);

  // import svg icon by name
  const Icon: React.FC<SvgProps> = (name && icon[name]) || icon.questionCircle;
  const presetStyle = IconSize[preset];
  const dimension = {
    width: normalize(size) || presetStyle,
    height: normalize(size) || presetStyle,
  };
  return (
    <>
      {isImage && (
        <Image
          style={{ width: dimension.width, height: dimension.height }}
          resizeMode={FastImage.resizeMode.contain}
          source={imgSrc[name] && imgSrc[name]}
        />
      )}
      {!isImage && (
        <Icon
          width={dimension.width}
          height={dimension.height}
          color={color || colors.text}
          {...rest}
        />
      )}
    </>
  );
}

export default memo(SvgIcon, isEqual);
