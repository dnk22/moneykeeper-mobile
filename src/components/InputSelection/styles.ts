import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemGroup: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 30,
    height: 30,
  },
  groupContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  iconForward: {
    position: 'absolute',
    right: 6,
    opacity: 0.8,
  },
  value: {
    height: '80%',
    maxWidth: '90%',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 10,
  },
  inputField: {
    display: 'none',
  },
  content: {
    maxWidth: '90%',
  },
});

export default styles;
