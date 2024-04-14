import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pieInnerCenter: {
    gap: 4,
    alignItems: 'center',
  },
  pieChart: {
    height: 180,
    gap: 30,
    marginBottom: 5,
    marginVertical: 8,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalAmount: {
    maxWidth: 100,
    fontWeight: '500',
  },
  barName: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },
  pieDescription: {
    gap: 15,
  },
  fontWeight300: {
    fontWeight: '300',
  },
});
export default styles;
