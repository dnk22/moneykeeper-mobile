import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH, bottomBarFlatHeight } from 'share/dimensions';

const styles = StyleSheet.create({
  tabBar: {
    height: bottomBarFlatHeight,
    borderTopColor: '#F2F2F2',
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  component: {
    height: 80,
    position: 'relative',
    width: (SCREEN_WIDTH - 100) / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemActive: {
    position: 'absolute',
    width: '100%',
    height: 4,
    top: 0,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  icon: {
    marginBottom: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default styles;
