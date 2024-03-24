import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  detail: {
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  itemColor: {
    width: 5,
    height: '90%',
    borderRadius: 10,
  },
  accountName: {
    fontWeight: '500',
    gap: 5,
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  amount: {
    maxWidth: 130,
  },
  personLogo: {
    width: 38,
    height: 38,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
