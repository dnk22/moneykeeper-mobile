import { StyleSheet } from 'react-native';
import { bottomBarStickyHeight } from 'share/dimensions';

const styles = StyleSheet.create({
  bottomBarContainer: {
    height: bottomBarStickyHeight,
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
    paddingHorizontal: 5,
  },
  component: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    flex: 0,
    width: 50,
    height: 50,
    borderRadius: 30,
    marginHorizontal: 10,
  },
});

export default styles;
