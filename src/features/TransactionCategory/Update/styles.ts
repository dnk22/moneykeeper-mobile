import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 10,
    paddingTop: 15,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 30,
    alignSelf: 'center',
    borderWidth: 0.2,
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  formInput: {
    height: 50,
    fontSize: 20,
    width: '100%',
  },
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
  },
});

export default styles;