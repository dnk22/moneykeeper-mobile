import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    marginVertical: 2,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  itemContent: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});

export default styles;
