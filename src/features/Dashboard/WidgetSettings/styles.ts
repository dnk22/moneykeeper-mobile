import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
