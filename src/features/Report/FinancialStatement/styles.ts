import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 2,
  },
  totalMoney: {
    padding: 5,
    marginBottom: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontWeight300: {
    fontWeight: '300',
  },
  totalAmount: {
    maxWidth: 130,
    fontWeight: '500',
  },
});
export default styles;
