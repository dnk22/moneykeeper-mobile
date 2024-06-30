import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 50,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateView: {
    flexDirection: 'row',
  },
  modalContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modalTitle: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  bottom: {
    borderBottomWidth: 0,
    borderTopWidth: 0.5,
  },
  modalInnerView: {
    paddingVertical: 0,
  },
  title: {
    fontWeight: '500',
  },
});
export default styles;
