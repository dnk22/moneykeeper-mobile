import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // tabBar
  tabBarContainer: {
    height: 40,
    padding: 5,
  },
  tabBarContentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    borderRadius: 14,
    height: 42,
    marginTop: 5,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  tabBarLabelStyle: {
    textTransform: 'capitalize',
  },
  indicator: {
    position: 'absolute',
    zIndex: -1,
    height: 34,
    top: 4,
    borderRadius: 10,
    width: '48%',
    left: 4,
  },
});

export default styles;
