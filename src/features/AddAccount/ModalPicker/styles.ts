import { StyleSheet } from 'react-native';
import { normalize } from 'share/dimensions';

const styles = StyleSheet.create({
  bankModal: { maxHeight: '90%' },
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
  itemActive: {
    marginRight: 13,
    padding: 2,
    borderColor: '#787A91',
    borderWidth: 1,
    width: normalize(14),
    height: normalize(14),
    borderRadius: 30,
  },
  itemActiveBackground: {
    flex: 1,
    borderRadius: 30,
  },
  title: {
    fontSize: normalize(16),
  },
  subTitle: {
    opacity: 0.5,
  },
});

export default styles;
