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
  formInput: {
    height: 50,
    fontSize: 20,
    width: '100%',
  },
  subText: {
    opacity: 0.5,
  },
  statementDay: {
    width: 55,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#e8e9eb',
    padding: 10,
    borderRadius: 10,
  },
  itemNotification: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default styles;
