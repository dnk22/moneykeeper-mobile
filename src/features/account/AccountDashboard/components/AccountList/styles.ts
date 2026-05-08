import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 5,
    borderRadius: 8,
    
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    padding: 12,
  },
  itemCenter: {
    flex: 1,
    rowGap: 5,
  },
  itemAction: {
    width: 50,
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
    height: 0.5,
    marginHorizontal: 12,
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
    width: 28,
    height: 28,
  },
});

export default styles;
