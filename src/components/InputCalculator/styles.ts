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
    fontSize: 40,
    fontWeight: '500',
  },
  amountLabel: {
    textAlign: 'right',
  },
  currency: {
    marginLeft: 5,
  },
  calcRow: {
    flexDirection: 'row',
    gap: 4,
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  enterButton: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  handleIndicatorStyle: {
    display: 'none',
  },
  keyBoardContainer: {
    gap: 4,
  },
});

export default styles;
