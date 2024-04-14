import { StyleSheet } from 'react-native';
import { MARGIN_LEFT, CHILD_ITEM_TRANSACTION_HEIGHT } from 'share/dimensions';

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
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
  parentLine: {
    zIndex: 2,
    position: 'absolute',
    left: MARGIN_LEFT,
    top: CHILD_ITEM_TRANSACTION_HEIGHT,
    borderStyle: 'dashed',
    borderWidth: 0.6,
    borderRadius: 1,
    borderColor: '#d3d3d3',
  },
});

export default styles;
