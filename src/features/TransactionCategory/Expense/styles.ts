import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  group: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  mostRecent: {
    height: 100,
  },
  itemCategory: {
    maxHeight: 200,
  },
  addIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
