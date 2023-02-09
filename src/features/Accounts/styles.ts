import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  totalBalance: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalCurrency: {
    fontWeight: '700',
  },
  createButton: {
    position: 'absolute',
    right: 30,
    bottom: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccounts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
