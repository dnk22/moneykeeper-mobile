import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  modalView: {
    flexDirection: 'column',
    borderRadius: 8,
    padding: 10,
    paddingBottom: 40,
    width: '100%',
    alignSelf: 'flex-end',
  },
  modalAction: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerBorder: {
    borderBottomWidth: 0.5,
  },
});
