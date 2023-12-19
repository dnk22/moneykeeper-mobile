import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  action: {
    flex: 1,
    columnGap: 10,
    flexDirection: 'row',
  },
  buttonDel: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
  },
  button: {
    flex: 1,
    height: 50,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default styles;
