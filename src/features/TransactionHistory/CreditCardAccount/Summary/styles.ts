import { StyleSheet } from 'react-native';
import { BOX_SHADOW } from 'resources/theme/constants';

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    ...BOX_SHADOW,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: '70%',
    borderWidth: 0.4,
    borderColor: 'gray',
  },
  item: {
    flex: 1,
    rowGap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    columnGap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    height: 15,
    borderRadius: 4,
    overflow: 'hidden',
  },
  expense: {
    height: 20,
    backgroundColor: '#FF3232',
  },
  available: {
    backgroundColor: '#45f248',
    height: 20,
  },
  boxIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 4,
  },
});

export default styles;
