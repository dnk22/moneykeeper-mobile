import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

export const styles = StyleSheet.create({
  container: {
    zIndex: 100000,
  },
  top: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  widgetCard: {
    height: 80,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  cardTopOutline: {
    top: -5,
    left: -4,
    height: 25,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 5,
    borderRadius: 12,
  },
  cardTop: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingLeft: 10,
    borderRadius: 20,
  },
  cardTopCenter: {
    height: 5,
    width: '100%',
    borderRadius: 30,
  },
  totalBalance: {
    rowGap: 5,
    paddingHorizontal: 15,
  },
  leftToolbar: {
    height: 32,
    width: 50,
    top: 32,
    right: 0,
    padding: 4,
    alignSelf: 'center',
    position: 'absolute',
    borderTopStartRadius: 30,
    borderBottomStartRadius: 30,
  },
  sync: {
    width: 50,
    right: 0,
    padding: 4,
    paddingHorizontal: 15,
    borderTopStartRadius: 30,
    borderBottomStartRadius: 30,
  },
  viewTotalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
