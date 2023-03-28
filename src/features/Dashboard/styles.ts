import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

const oval1Width = SCREEN_WIDTH * 0.5,
  oval2Width = SCREEN_WIDTH * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  oval1: {
    position: 'absolute',
    width: oval1Width,
    height: oval1Width,
    borderRadius: oval1Width / 2,
    backgroundColor: 'red',
    top: -oval2Width / 3,
    left: -10,
  },
  oval2: {
    position: 'absolute',
    width: oval2Width,
    height: oval2Width,
    borderRadius: oval2Width / 2,
    backgroundColor: 'blue',
    top: -oval2Width / 2.5,
    right: -10,
  },
});

export default styles;
