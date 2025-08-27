import { StyleSheet } from 'react-native';

export const accountDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 5,
  },
  accountWrapper: {
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pagerContainer: {
    flex: 1,
  },
});

export const accountListStyles = StyleSheet.create({
  itemContainer: {
  },
  itemContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingLeft: 12,
    paddingRight: 6,
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
  emptyText: {
    marginTop: '50%',
  },
  itemIcon: {
    width: 40,
    height: 40,
  },
});
