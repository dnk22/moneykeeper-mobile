import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

export const styles = StyleSheet.create({
  container: {
    zIndex: 100000,
  },
  top: {
    paddingHorizontal: 15,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  widgetCard: {
    borderRadius: 10,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  cardTopOutline: {
    top: -5,
    left: -4,
    height: 24,
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
    paddingLeft: 8,
    borderRadius: 20,
  },
  cardTopCenter: {
    height: 2,
    width: '100%',
    borderRadius: 30,
  },
  totalBalance: {
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
  leftToolbar: {
    width: 50,
    top: 34,
    right: 0,
    padding: 2,
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
  notifications: {
    padding: 3,
  },
});
