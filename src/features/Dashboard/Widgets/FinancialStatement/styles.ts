import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    zIndex: 100000,
  },
  top: {
    paddingHorizontal: 20,
    paddingBottom: 10,
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
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
  },
  topBarToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    padding: 8,
    paddingHorizontal: 20,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  topBarBalance: {
    rowGap: 5,
  },
  viewTotalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
