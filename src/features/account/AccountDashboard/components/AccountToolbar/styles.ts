import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgb(200,200,200)',
  },
  group: {
    paddingTop: 10,
  },
  groupHeader: {
    opacity: 0.7,
  },
  groupContent: {
    height: 55,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});

export default styles;
