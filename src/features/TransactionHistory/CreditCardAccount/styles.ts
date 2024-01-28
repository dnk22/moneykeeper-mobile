import { StyleSheet } from 'react-native';
import { BOX_SHADOW } from 'resources/theme/constants';
import { CONTAINER_PADDING } from 'share/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CONTAINER_PADDING,
  },
  createButton: {
    zIndex: 5,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewByMonth: {
    marginVertical: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStatement: {
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemStatementMonth: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  otherStatement: {
    padding: 4,
    paddingHorizontal: 15,
    borderRadius: 30,
    ...BOX_SHADOW,
  },
});

export default styles;
