import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 3,
  },
  itemContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
    paddingHorizontal: 10,
  },
  itemCenter: {
    flex: 1,
    rowGap: 5,
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
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  inputGroup: {
    justifyContent: 'center',
    borderRadius: 10,
  },
  inputSearch: {
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  iconSearch: {
    left: 10,
    position: 'absolute',
  },
});

export default styles;
