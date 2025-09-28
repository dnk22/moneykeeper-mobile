import { StyleSheet } from 'react-native';
import { BOX_SHADOW } from 'resources/theme/constants';

export const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    ...BOX_SHADOW,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  noData: {
    gap: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  addTransactionNow: {
    paddingRight: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 5,
  },
  row: {
    gap: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  col: {
    flex: 1,
    rowGap: 15,
    paddingHorizontal: 5,
  },
  moneyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneyItemTitle: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    width: '96%',
    alignSelf: 'center',
  },
  incomeIcon: {
    backgroundColor: '#CEE2E8',
    borderColor: '#17C03F',
    borderWidth: 1,
  },
  expenseIcon: {
    backgroundColor: '#DEBDC5',
    borderColor: '#E25C5C',
    borderWidth: 1,
  },
  balanceIcon: {
    backgroundColor: '#F0E0B7',
    borderColor: '#FCAA18',
    borderWidth: 1,
  },
  chartView: {
    height: 120,
    gap: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  chart: {
    height: '100%',
    width: 40,
    borderRadius: 6,
  },
  chartBalance: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FCAA18',
  },
  progressBar: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  barName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 20,
  },
});
