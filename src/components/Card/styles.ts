import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    margin: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  iconDropdown: {
    width: 30,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 10,
  },
});

export default styles;
