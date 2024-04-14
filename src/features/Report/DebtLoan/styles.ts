import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  tabBarContentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    borderRadius: 14,
    height: 42,
    overflow: 'hidden',
  },
  tabBarLabelStyle: {
    textTransform: 'capitalize',
    fontSize: 15,
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
