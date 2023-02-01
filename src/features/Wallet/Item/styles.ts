import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  touch: {
    marginVertical: 5,
  },
  container: {
    flex: 1,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderColor: 'rgb(200, 200, 200)',
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
  accountInfo: {
    width: '100%',
  },
});

export default styles;
