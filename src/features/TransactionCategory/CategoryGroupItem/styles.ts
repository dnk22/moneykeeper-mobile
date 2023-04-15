import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  group: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxHeight: 300,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    padding: 5,
  },
  headerTitle: {
    flex: 1,
  },
  divider: {
    borderTopWidth: 0.2,
    borderColor: 'lightgray',
    margin: 5,
  },
});

export default styles;
