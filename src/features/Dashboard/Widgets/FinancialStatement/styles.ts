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
    height: 60,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  widgetCard: {
    height: 80,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  topBarToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    padding: 8,
    bottom: 20,
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
