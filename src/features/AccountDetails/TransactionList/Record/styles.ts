import { StyleSheet } from 'react-native';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';

const styles = StyleSheet.create({
  record: {
    flexDirection: 'row',
    width: '100%',
    height: ITEM_HEIGHT,
    position: 'relative',
    marginTop: MARGIN_TOP,
    borderRadius: 10,
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
});

export default styles;
