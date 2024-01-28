import { StyleSheet } from 'react-native';
import { ITEM_HEIGHT, MARGIN_LEFT } from 'share/dimensions';

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
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
  parentLine: {
    zIndex: 2,
    position: 'absolute',
    left: MARGIN_LEFT,
    top: ITEM_HEIGHT,
    borderStyle: 'dashed',
    borderWidth: 0.6,
    borderRadius: 1,
    borderColor: '#d3d3d3',
  },
});

export default styles;
