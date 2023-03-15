import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modal: {
    padding: 5,
  },
  item: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
});

export default styles;
