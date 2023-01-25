import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  contentView: {
    position: 'absolute',
    top: '25%',
    width: '90%',
    borderRadius: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  pickerHeader: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    height: '60%',
    width: 1,
  },
  itemHeader: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  pickerContent: {
    padding: 10,
    paddingBottom: 0,
    borderRadius: 10,
  },
  dateTimeText: {
    fontSize: 18,
  },
  bottomBar: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.2,
    borderTopColor: '#eee',
  },
  actionDate: {
    fontSize: 16,
  },
  bright: {
    height: 30,
    width: 10,
    borderRadius: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  brightLeft: {
    top: 50,
    left: 40,
  },
  brightRight: {
    top: 50,
    right: 40,
  },
});

export default styles;
