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
  iconView: {
    padding: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
  },
  iconViewEdit: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  divider: {
    borderTopWidth: 0.2,
    borderColor: 'lightgray',
    margin: 5,
  },
});

export default styles;
