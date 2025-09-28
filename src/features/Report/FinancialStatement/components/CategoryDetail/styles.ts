import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  detail: {
    flex: 1,
    padding: 8,
  },
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsDot: {
    transform: [{ rotate: '90deg' }],
  },
  amountView: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default styles;
