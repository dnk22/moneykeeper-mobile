import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  actionView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  rightAction: {
    alignItems: 'flex-end',
  },
  transactionTypePicker: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#BCCEF8',
    borderRadius: 30,
  },
  noAccountData: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 0.3,
    marginBottom: 10,
  },
  form: {
    flex: 1,
    padding: 10,
  },
  group: {
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  expandGroup: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemGroup: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemGroupBetween: {
    justifyContent: 'space-between',
  },
  groupContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    opacity: 0.6,
  },
  iconForward: {
    position: 'absolute',
    right: 6,
  },
  formInput: {
    height: 50,
    fontSize: 20,
    width: '100%',
  },
  subText: {
    opacity: 0.5,
  },
  submit: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default styles;
