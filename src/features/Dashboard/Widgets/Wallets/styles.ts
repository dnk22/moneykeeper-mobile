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
  },
  amount: {
    fontWeight: 'bold',
  },
});
