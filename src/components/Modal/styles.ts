import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 10,
    justifyContent: 'flex-end',
  },
  modalView: {
    flexDirection: 'column',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderRadius: 15,
    padding: 15,
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
