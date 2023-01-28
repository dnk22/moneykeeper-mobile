import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemGroup: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    opacity: 0.6,
  },
  iconForward: {
    position: 'absolute',
    right: 6,
  },
  value: {
    backgroundColor: '#c8d0ce',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});

export default styles;
