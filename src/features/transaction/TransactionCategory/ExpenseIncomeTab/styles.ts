import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from 'share/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  top: {
    gap: 10,
    padding: 8,
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
  flatListContainer: {
    paddingTop: 2,
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
});
