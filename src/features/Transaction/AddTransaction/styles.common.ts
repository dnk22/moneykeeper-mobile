import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 55,
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
  iconShadow: {
    color: '#adb5bd',
  },
  iconForward: {
    position: 'absolute',
    right: 6,
  },
  iconExchange: {
    marginRight: 10,
  },
  formInput: {
    height: 50,
    width: '100%',
  },
  currentBalance: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;
