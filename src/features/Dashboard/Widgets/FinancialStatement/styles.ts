import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 160,
    position: 'absolute',
    zIndex: 1000,
  },
  topBarBackground: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    marginBottom: 70,
  },
  widget: {
    width: '100%',
    height: 140,
    paddingHorizontal: 20,
    position: 'relative',
    bottom: -50,
    rowGap: 10,
  },
  widgetText: {
    paddingLeft: 10,
  },
  widgetCard: {
    height: 120,
    borderRadius: 20,
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
    height: 60,
    width: '40%',
    position: 'absolute',
    right: 0,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarCurrency: {
    rowGap: 10,
  },
  viewTotalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
