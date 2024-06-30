import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  barChartContainer: {
    paddingBottom: 6,
    borderRadius: 8,
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barChartTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
export default styles;
