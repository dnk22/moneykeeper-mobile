import { SCREEN_HEIGHT, normalize } from 'share/dimensions';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    height: 60,
    textAlign: 'right',
    fontSize: normalize(32),
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: 'rgb(242,242,242)',
  },
  currency: {
    fontSize: 24,
    marginLeft: 5,
  },
  keyboardModal: {
    width: '100%',
    position: 'absolute',
    bottom: -SCREEN_HEIGHT,
    backgroundColor: 'red',
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
