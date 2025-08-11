import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

const styles = StyleSheet.create({
  transactionTypePicker: {
    height: 36,
    width: SCREEN_WIDTH / 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BCCEF8',
    borderRadius: 10,
  },
  modal: {
    padding: 8,
    height: 'auto',
    minHeight: 420,
    flexDirection: 'column',
    borderRadius: 20,
  },
  item: {
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
  },
});

export default styles;
