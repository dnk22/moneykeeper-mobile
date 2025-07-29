import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  searchBar: {
    gap: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactPicker: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  contactItem: {
    gap: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
  },
  addItem: {
    gap: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
  contactAvt: {
    height: 40,
    width: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputForm: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  listContainer: {
    borderRadius: 5,
    flex: 1,
    marginBottom: 40,
  },
});
export default styles;
