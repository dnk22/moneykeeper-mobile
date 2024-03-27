import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
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
  },
  noData: {
    paddingVertical: 20,
    alignItems: 'center',
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
    width: '90%',
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
    width: 60,
    borderRadius: 4,
  },
  chartBalance: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FCAA18',
  },
  progressBar: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 20,
  },
});