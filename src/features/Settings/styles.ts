import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  group: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 30,
  },
  premium: {
    padding: 10,
    paddingHorizontal: 15,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  premiumSubTitle: {
    marginBottom: 10,
  },
  premiumIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
  },
  item: {
    height: 44,
    marginLeft: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
  itemNavigation: {
    position: 'absolute',
    right: 15,
  },
  itemBorderBottom: {
    borderBottomWidth: 0.2,
    borderColor: '#ccc',
  },
  version: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default styles;
