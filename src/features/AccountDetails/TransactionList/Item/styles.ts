import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  header: {
    zIndex: 3,
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    borderRadius: 10,
  },
  day: {
    fontWeight: '500',
  },
  dayExpense: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  recordView: {
    width: '90%',
    alignSelf: 'flex-end',
  },
  parentLine: {
    zIndex: 2,
    position: 'absolute',
    left: '5%',
    top: 50,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderRadius: 1,
    borderColor: '#d3d3d3',
  },
});

export default styles;
