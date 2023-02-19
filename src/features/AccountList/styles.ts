import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  groupTitle: {
    marginTop: 5,
    opacity: 0.7,
  },
  itemContainer: {
    paddingVertical: 5,
  },
  itemContent: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 10,
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
});

export default styles;
