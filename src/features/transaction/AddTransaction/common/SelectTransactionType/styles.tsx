import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

const styles = StyleSheet.create({
  transactionTypePicker: {
    height: 35,
    width: SCREEN_WIDTH / 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BCCEF8',
    borderRadius: 30,
  },
  modal: {
    padding: 5,
  },
  item: {
    flex: 1,
    padding: 20,
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
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
});

export default styles;
