import { StyleSheet } from 'react-native';
import {
  CHILD_LINE_WIDTH,
  CONTAINER_PADDING,
  ITEM_HEIGHT,
  MARGIN_LEFT,
  MARGIN_TOP,
} from 'share/dimensions';
import { SCREEN_WIDTH } from 'share/dimensions';

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
    width: SCREEN_WIDTH - MARGIN_LEFT - CONTAINER_PADDING * 2 - CHILD_LINE_WIDTH,
    marginTop: MARGIN_TOP,
    borderRadius: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'red',
  },
  childLine: {
    position: 'absolute',
    top: (ITEM_HEIGHT + MARGIN_TOP) / 2,
    width: CHILD_LINE_WIDTH,
    left: MARGIN_LEFT,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#d3d3d3',
  },
  transactionCategoryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  detailInfo: {
    flex: 1,
    gap: 5,
  },
  textDescription: {
    fontStyle: 'italic',
  },
  amountInfo: {
    flex: 0.5,
    rowGap: 5,
    alignItems: 'flex-end',
  },
});

export default styles;
