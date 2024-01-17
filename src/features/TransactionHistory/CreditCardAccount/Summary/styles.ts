import { StyleSheet } from 'react-native';
import { BOX_SHADOW } from 'resources/theme/constants';

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    ...BOX_SHADOW,
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: '80%',
    width: 0.8,
    backgroundColor: 'gray',
  },
  dividerHorizontal: {
    width: '100%',
    height: 0.8,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginVertical: 10,
  },
  item: {
    flex: 1,
    rowGap: 4,
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
    marginTop: 10,
    width: '100%',
    height: 10,
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
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 4,
  },
});

export default styles;
