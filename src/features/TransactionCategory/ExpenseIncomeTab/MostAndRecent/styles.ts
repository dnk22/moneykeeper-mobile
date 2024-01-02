import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  group: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  menu: {
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAs: {
    width: '40%',
  },
  itemChild: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 4,
  },
  iconView: {
    padding: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
  },
});

export default styles;
