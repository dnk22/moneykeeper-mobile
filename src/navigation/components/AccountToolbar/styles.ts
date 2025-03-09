import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  group: {
    paddingTop: 10,
    borderTopWidth: 0.2,
    borderColor: 'rgb(200,200,200)',
  },
  groupHeader: {
    opacity: 0.7,
  },
  groupContent: {
    height: 50,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;
