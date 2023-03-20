import { RNText } from 'components/index';
import SvgIcon from 'components/SvgIcon';
import { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';
import styles from './styles';

function Child({ item }) {
  const width = useMemo(() => (SCREEN_WIDTH - 40) / 4, []);
  return (
    <View style={[styles.itemChild, { width }]}>
      <SvgIcon name={item.icon} size={28} />
      <RNText numberOfLines={1}>{item.categoryName}</RNText>
    </View>
  );
}
export default memo(Child,isEqual);
