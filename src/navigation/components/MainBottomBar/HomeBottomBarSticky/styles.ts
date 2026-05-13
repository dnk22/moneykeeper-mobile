import { StyleSheet } from 'react-native';
import { bottomBarStickyHeight } from 'share/dimensions';

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: bottomBarStickyHeight,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  tabBar: {
    height: '100%',
    width: '100%',
    borderRadius: 40,
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
