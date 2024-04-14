import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLine: {
    marginVertical: 5,
  },
  title: {
    opacity: 0.7,
    fontWeight: '300',
  },
  value: { fontWeight: '500' },
});
export default styles;
