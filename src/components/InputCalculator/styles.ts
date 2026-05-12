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
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 8,
  },
  enterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  modalContainer: {
    padding: 8,
    paddingVertical: 16,
  },
  keyBoardContainer: {
    gap: 4,
    paddingHorizontal: 6,
    paddingTop: 12,
  },
  numberText: {
    fontSize: 21,
    fontWeight: '500',
  },
  operatorText: {
    fontSize: 20,
    fontWeight: '500',
  },
  doneText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default styles;
