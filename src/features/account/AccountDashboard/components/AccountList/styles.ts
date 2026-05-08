import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 5,
    borderRadius: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    padding: 12,
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
  itemFooter: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  itemTitle: {
    fontWeight: '500',
    flex: 1,
  },
  itemSubTitle: {
    fontWeight: '600',
  },
  emptyText: {
    marginTop: '50%',
  },
  itemIcon: {
    width: 40,
    height: 40,
  },
});

export default styles;
