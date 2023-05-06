import { StyleSheet } from 'react-native';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  record: {
    height: ITEM_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  swipe: {
    width: '90%',
    marginTop: MARGIN_TOP,
    borderRadius: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'red',
  },
  childLine: {
    position: 'absolute',
    top: (ITEM_HEIGHT + MARGIN_TOP) / 2,
    width: '5%',
    left: '5%',
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#d3d3d3',
  },
  transactionCategoryInfo: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  amountInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default styles;
