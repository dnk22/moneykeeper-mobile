import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 5,
  },
  itemContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 5,
  },
  itemCenter: {
    flex: 1,
    rowGap: 5,
  },
  itemAction: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontWeight: '500',
    width: '100%',
  },
  itemSubTitle: {
    width: '100%',
    opacity: 0.7,
  },

  // card
  wrapper: {
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    // ...BOX_SHADOW,
  },
  header: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  iconSwapContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSwap: {
    transform: [{ rotate: '90deg' }],
  },
  divider: {
    width: '100%',
    height: 0.5,
    marginBottom: 10,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  createButton: {
    position: 'absolute',
    right: 30,
    bottom: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
