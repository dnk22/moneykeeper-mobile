import { StyleSheet } from 'react-native';
import { CONTAINER_PADDING } from 'share/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CONTAINER_PADDING,
  },
  createButton: {
    zIndex: 5,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
