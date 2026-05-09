import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', marginBottom: -10 },
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
    padding: 10,
    paddingBottom: 15,
    marginBottom: 10,
  },
  headerBorder: {
    borderBottomWidth: 0.5,
  },
});
