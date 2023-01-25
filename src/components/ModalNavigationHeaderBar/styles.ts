import { StyleSheet } from 'react-native';
import { ModalNavigationHeaderBarDimensions } from 'share/dimensions';

const styles = StyleSheet.create({
  container: {
    height: ModalNavigationHeaderBarDimensions.headerBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#C6C6C8',
    paddingHorizontal: 20,
  },
  center: { flex: 4 },
  titleText: {
    fontSize: ModalNavigationHeaderBarDimensions.titleFontSize,
    fontWeight: '700',
  },
  right: { alignItems: 'flex-end' },
});
export default styles;
