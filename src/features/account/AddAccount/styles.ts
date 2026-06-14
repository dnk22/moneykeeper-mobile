import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  form: {
    flex: 1,
    padding: 10,
  },
  group: {
    borderRadius: 8,
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
    alignItems: 'center',
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
    flex: 1,
    height: 50,
    fontSize: 20,
  },
  subText: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
  statementDay: {
    width: 55,
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
  },
  itemNotification: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  saveButton: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  switch: {
    marginTop: 10,
  },
});

export default styles;
