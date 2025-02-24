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
    height: 44,
    marginTop: 10,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  tabBarLabelStyle: {
    textTransform: 'capitalize',
  },
  indicator: {
    height: 40,
    margin: 2,
    borderRadius: 12,
  },
});

export default styles;
