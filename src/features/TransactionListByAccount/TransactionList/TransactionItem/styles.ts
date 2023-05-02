import { StyleSheet } from 'react-native';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';

const styles = StyleSheet.create({
  record: {
    width: '90%',
    height: ITEM_HEIGHT,
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: MARGIN_TOP,
    borderRadius: 10,
    paddingHorizontal: '5%',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  childLine: {
    width: '5%',
    position: 'absolute',
    left: '-5%',
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderRadius: 1,
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
