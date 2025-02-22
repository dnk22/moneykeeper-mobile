import React, { memo, useMemo } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import { normalize } from 'share/dimensions';
import { textPresets } from './preset';

export interface TTextProps extends TextProps {
  text?: string;
  children?: string | number;
  color?: string;
  style?: StyleProp<TextStyle>;
  fontSize?: number;
  preset?: keyof typeof textPresets;
}

function RNText({
  text,
  children,
  color,
  fontSize,
  style,
  preset = 'default',
  numberOfLines = 1,
  ...props
}: TTextProps) {
  const { colors } = useCustomTheme();

  const content = useMemo(() => text ?? children, [text, children]);
  const textColor = useMemo(() => color ?? colors.text, [color, colors.text]);
  const textSize = useMemo(() => normalize(fontSize ?? 16), [fontSize]);

  return (
    <Text
      allowFontScaling={false}
      style={[style, { color: textColor, fontSize: textSize }, textPresets[preset]]}
      ellipsizeMode="tail"
      numberOfLines={numberOfLines}
      {...props}
    >
      {content}
    </Text>
  );
}

export default memo(RNText, isEqual);
