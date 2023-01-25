import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  actionView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  leftAction: {
    alignItems: 'flex-start',
  },
  rightAction: {
    alignItems: 'flex-end',
  },
  // tabBar
  tabBarContainer: {
    height: 40,
    padding: 5,
  },
});

export default styles;
