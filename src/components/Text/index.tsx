import React, { memo, useMemo } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import isEqual from 'react-fast-compare';
// import { useTranslation } from 'react-i18next';
import { useCustomTheme } from 'resources/theme';
import { normalize } from 'share/dimensions';
import { textPresets } from './preset';

export interface TTextProps extends TextProps {
  text?: 'string';
  children?: string | number;
  t18n?: any;
  t18nOptions?: any;
  color?: string;
  style?: StyleProp<TextStyle>;
  fontSize?: number;
  preset?: keyof typeof textPresets;
}

function RNText({
  text,
  children,
  t18n,
  t18nOptions,
  color,
  fontSize = 14,
  style,
  preset = 'default',
  numberOfLines = 1,
  ...props
}: TTextProps) {
  const { colors } = useCustomTheme();
  // setup translation
  // const [t] = useTranslation();
  // const i18nText = useMemo(() => t18n && t(t18n, t18nOptions), [t18n, t18nOptions, t]);
  const content = useMemo(() => text || children, [, text, children]);

  const textColor = color || colors.text;
  const textSize = normalize(fontSize);
  const textPreset = textPresets[preset];
  return (
    <Text
      allowFontScaling={false}
      style={[style, { color: textColor, fontSize: textSize }, textPreset]}
      ellipsizeMode="tail"
      numberOfLines={numberOfLines}
      {...props}
    >
      {content}
    </Text>
  );
}

export default memo(RNText, isEqual);
