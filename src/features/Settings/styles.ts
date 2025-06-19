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
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: 'red',
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
    gap: 15,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    height: 44,
    flex: 1,
    justifyContent: 'center',
  },
  itemNavigation: {
    position: 'absolute',
    right: 15,
  },
  itemBorderBottom: {
    borderBottomWidth: 0.2,
  },
  version: {
    textAlign: 'center',
    color: 'gray',
  },
  logout: {
    width: '100%',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
