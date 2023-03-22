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
    paddingVertical: 5,
  },
  headerTitle: {
    flex: 1,
  },
  childView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemChild: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
