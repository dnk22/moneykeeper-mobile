import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    paddingBottom: 8,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  group: {
    padding: 6,
    borderRadius: 8,
    rowGap: 12,
  },
  dateTitle: {
    textTransform: 'capitalize',
    marginLeft: 5,
  },
  itemDetail: {
    width: '100%',
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    rowGap: 4,
  },
  itemTitle: {
    opacity: 0.7,
    fontWeight: '300',
  },
  barChartContainer: {
    paddingBottom: 10,
    borderRadius: 8,
  },
});
export default styles;
