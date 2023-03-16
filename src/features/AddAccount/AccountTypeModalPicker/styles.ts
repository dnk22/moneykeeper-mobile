import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});

export default styles;
