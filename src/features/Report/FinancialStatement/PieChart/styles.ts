import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pieInnerCenter: {
    gap: 4,
    alignItems: 'center',
  },
  pieChart: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 5,
  },
  totalAmount: {
    maxWidth: 130,
    fontWeight: '500',
  },
  barName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },
  pieDescription: {
    height: 26,
    gap: 20,
  },
  fontWeight300: {
    fontWeight: '300',
  },
});
export default styles;
