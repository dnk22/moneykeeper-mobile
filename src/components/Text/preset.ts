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
    fontSize: normalize(22),
    fontWeight: '700',
  },
  widgetTitle: {
    fontWeight: '500',
    fontSize: 17,
  },
  widgetViewMore: {
    color: '#00a8e8',
    fontWeight: '500',
  },
  subTitle: {
    color: 'gray',
    fontSize: normalize(13),
    opacity: 0.7,
  },
  title: {
    fontSize: normalize(15),
    fontWeight: '500',
  },
  default: {},
});
