import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from 'share/dimensions';

const styles = StyleSheet.create({
  addIcon: {
    zIndex: 1,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.65,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
