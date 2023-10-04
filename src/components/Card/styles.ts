import { StyleSheet } from 'react-native';
import { BOX_SHADOW } from 'resources/theme/constants';

const styles = StyleSheet.create({
  wrapper: {
    margin: 5,
    // marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    ...BOX_SHADOW,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  iconDropdown: {
    width: 30,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    height: 'auto',
  },
});

export default styles;
