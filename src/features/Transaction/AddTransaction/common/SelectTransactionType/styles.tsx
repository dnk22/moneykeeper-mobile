import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

const styles = StyleSheet.create({
  transactionTypePicker: {
    height: 35,
    width: SCREEN_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BCCEF8',
    borderRadius: 30,
  },
});

export default styles;