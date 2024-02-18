import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  group: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  headerTitle: {
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    alignSelf: 'center',
    width: '100%',
    height: 0.6,
    marginVertical: 10,
  },
  itemChild: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 4,
  },
  childView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
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
});

export default styles;
