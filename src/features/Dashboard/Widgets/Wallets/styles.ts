import { BOX_SHADOW } from 'resources/theme/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 5,
    rowGap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    position: 'relative',
    width: 155,
    padding: 12,
    borderRadius: 14.25,
    marginRight: 14,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: '300',
  },
  amountView: {
    rowGap: 5,
    width: '100%',
  },
  amount: {
    fontWeight: 'bold',
    width: '100%',
  },
  noData: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...BOX_SHADOW,
  },
  addIcon: {
    borderRadius: 30,
    padding: 10,
    marginBottom: 5,
  },
  accountIcon: {
    position: 'absolute',
    bottom: 8,
    right: 10,
  },
});
