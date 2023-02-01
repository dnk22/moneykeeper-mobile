import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  touch: {
    paddingVertical: 5,
    borderBottomWidth: 0.2,
    borderColor: 'rgb(200, 200, 200)',
  },
  container: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  action: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    fontWeight: '500',
    width: '100%',
  },
  accountAmount: {
    width: '100%',
    opacity: 0.7,
  },
});

export default styles;
