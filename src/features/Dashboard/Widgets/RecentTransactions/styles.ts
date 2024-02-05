import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 330,
    paddingHorizontal: 10,
  },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemCategory: {
    fontWeight: '500',
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  itemDateTime: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rowGap: {
    rowGap: 5,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
