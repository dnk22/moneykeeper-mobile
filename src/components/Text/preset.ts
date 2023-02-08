import { normalize } from 'share/dimensions';
import { StyleSheet } from 'react-native';

export const textPresets = StyleSheet.create({
  linkTitle: {
    fontSize: normalize(24),
  },
  linkSubtitle: {
    fontSize: normalize(20),
  },
  linkLarge: {
    fontSize: normalize(18),
  },
  linkMedium: {
    fontSize: normalize(16),
  },
  linkSmall: {
    fontSize: normalize(14),
  },
  linkXSmall: {
    fontSize: normalize(11),
  },
  linkXXSmall: {
    fontSize: normalize(9),
  },
  textMedium: {
    fontSize: normalize(16),
  },
  textSmall: {
    fontSize: normalize(14),
  },
  textXSmall: {
    fontSize: normalize(11),
  },
  textXXSmall: {
    fontSize: normalize(9),
  },
  modalTitle: {
    fontSize: normalize(18),
    fontWeight: '500',
  },
  homeTotalBalance: {
    fontSize: normalize(24),
    fontWeight: '500',
  },
  widgetTitle: {
    fontWeight: '700',
  },
  widgetViewMore: {
    color: '#00a8e8',
  },
  subTitle: {
    color: 'gray',
    fontSize: normalize(13),
  },
  default: {},
});
