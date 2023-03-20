import { memo } from 'react';
import { View } from 'react-native';
import { RNText, SvgIcon } from 'components/index';
import { TTransactionsCategory } from 'database/types';
import isEqual from 'react-fast-compare';
import { SCREEN_WIDTH } from 'share/dimensions';
import styles from './styles';
const width = (SCREEN_WIDTH - 40) / 4;

type ChildProps = {
  item: TTransactionsCategory;
};

function Child({ item }: ChildProps) {
  return (
    <View style={[styles.itemChild, { width }]}>
      <SvgIcon name={item.icon} size={28} />
      <RNText numberOfLines={1}>{item.categoryName}</RNText>
    </View>
  );
}
export default memo(Child, isEqual);
