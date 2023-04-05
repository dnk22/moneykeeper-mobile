import { StyleSheet } from 'react-native';
import { BOX_SHADOW } from 'resources/theme/constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    ...BOX_SHADOW,
  },
  divider: {
    height: '70%',
    borderWidth: 0.4,
    borderColor: 'gray',
  },
  item: {
    flex: 1,
    rowGap: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    columnGap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
