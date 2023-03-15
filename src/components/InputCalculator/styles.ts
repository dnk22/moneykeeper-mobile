import { SCREEN_HEIGHT, normalize } from 'share/dimensions';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  group: {
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    height: 60,
    textAlign: 'right',
    fontSize: 32,
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: 'rgb(242,242,242)',
  },
  amountLabel: {
    textAlign: 'right',
  },
  currency: {
    fontSize: 24,
    marginLeft: 5,
  },
  calcRow: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(242,242,242)',
  },
  enterButton: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgb(242,242,242)',
  },
});

export default styles;
