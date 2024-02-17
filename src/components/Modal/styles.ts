import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 5,
    justifyContent: 'flex-end',
  },
  modalView: {
    flexDirection: 'column',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderRadius: 15,
    padding: 10,
  },
  modalAction: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
