import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from 'share/dimensions';

export const styles = StyleSheet.create({
  container: {
    padding: 6,
    flex: 1,
    position: 'relative',
  },
  addIcon: {
    zIndex: 1,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.47,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
