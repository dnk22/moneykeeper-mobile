import { StyleSheet } from 'react-native';
import { normalize } from 'share/dimensions';

const styles = StyleSheet.create({
  rightAction: {
    flex: 1,
    paddingHorizontal: normalize(30),
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: normalize(10),
  },
  actionIcon: {},
});

export default styles;
