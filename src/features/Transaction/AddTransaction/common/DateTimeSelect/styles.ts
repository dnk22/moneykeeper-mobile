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
  time: {
    position: 'absolute',
    right: 6,
  },
});

export default styles;
