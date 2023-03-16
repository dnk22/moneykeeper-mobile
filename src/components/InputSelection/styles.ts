import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemGroup: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  groupContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconForward: {
    position: 'absolute',
    right: 6,
    opacity: 0.8,
  },
  value: {
    maxWidth: '80%',
    backgroundColor: '#c8d0ce',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 10,
  },
});

export default styles;
