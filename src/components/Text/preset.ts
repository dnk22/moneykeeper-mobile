import { normalize } from 'share/dimensions';
import { StyleSheet, TextStyle } from 'react-native';

type TextPresets = {
  [key: string]: TextStyle;
};

const FONT_SIZES = {
  xxSmall: normalize(9),
  xSmall: normalize(11),
  small: normalize(14),
  medium: normalize(16),
  large: normalize(18),
  xLarge: normalize(20),
  xxLarge: normalize(24),
} as const;

const FONT_WEIGHTS = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

export const textPresets: TextPresets = StyleSheet.create({
  textLarge: { fontSize: FONT_SIZES.large },
  textMedium: { fontSize: FONT_SIZES.medium },
  textSmall: { fontSize: FONT_SIZES.small },
  textXSmall: { fontSize: FONT_SIZES.xSmall },
  textXXSmall: { fontSize: FONT_SIZES.xxSmall },

  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: FONT_WEIGHTS.medium,
  },
  homeTotalBalance: {
    fontSize: normalize(38),
    fontWeight: FONT_WEIGHTS.bold,
  },
  widgetTitle: {
    fontSize: normalize(17),
    fontWeight: FONT_WEIGHTS.medium,
  },
  widgetViewMore: {
    color: '#00a8e8',
    fontWeight: FONT_WEIGHTS.medium,
  },
  subTitle: {
    color: 'gray',
    fontSize: normalize(14),
    opacity: 0.7,
  },
  title: {
    // fontSize: normalize(16),
    fontWeight: FONT_WEIGHTS.medium,
  },
  default: {},
});
