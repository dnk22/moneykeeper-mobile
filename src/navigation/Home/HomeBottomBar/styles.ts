import { StyleSheet } from 'react-native';
import { bottomBarHeight } from 'share/dimensions';

const styles = StyleSheet.create({
  bottomBarContainer: {
    height: bottomBarHeight,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  tabBar: {
    height: '100%',
    width: '100%',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  component: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 30,
  },
  circle: {
    marginBottom: 20,
    backgroundColor: 'red',
  },
});

export default styles;
