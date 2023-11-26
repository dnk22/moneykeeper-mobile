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
    paddingHorizontal: 10,
    borderRadius: 10,
    // ...BOX_SHADOW,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  iconDropdown: {
    width: 30,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
