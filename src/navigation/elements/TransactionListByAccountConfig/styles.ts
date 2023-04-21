import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  group: {
    position: 'relative',
    borderWidth: 0.3,
    borderRadius: 10,
    borderColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  displayTextStyle: {
    position: 'absolute',
    top: -10,
    left: 15,
    paddingVertical: 2,
  },
  divider: {
    borderTopWidth: 0.2,
    borderColor: 'lightgray',
    marginBottom: 5,
    marginTop: 10,
    marginHorizontal: 5,
  },
});

export default styles;
