import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 10,
  },
  displayItem: {
    paddingVertical: 6,
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
  divider: {
    borderTopWidth: 0.2,
    borderColor: 'lightgray',
    marginBottom: 5,
    marginTop: 10,
    marginHorizontal: 5,
  },
  // display modal
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
});

export default styles;
