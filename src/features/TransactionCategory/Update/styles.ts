import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  groupContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  selectIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'red',
    marginBottom: 20,
    borderRadius: 30,
    alignSelf: 'center',
  },
  selectIconPlaceHolder: {
    width: 60,
    height: 40,
    borderRadius: 60,
    backgroundColor: 'blue',
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
  submit: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default styles;
