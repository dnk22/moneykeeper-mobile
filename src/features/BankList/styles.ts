import { StyleSheet } from 'react-native';
import { normalize } from 'share/dimensions';

const styles = StyleSheet.create({
  body: {
    padding: 10,
  },
  header: {
    height: 40,
    borderBottomWidth: 0.3,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  title: {
    fontSize: normalize(16),
  },
  subTitle: {
    opacity: 0.5,
  },
});

export default styles;
