import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 0.5,
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  iconSwapContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
