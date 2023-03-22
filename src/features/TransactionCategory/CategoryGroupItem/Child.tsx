import { View } from 'react-native';
import { RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { TTransactionsCategory } from 'database/types';
import { SCREEN_WIDTH } from 'share/dimensions';
import styles from './styles';

const width = (SCREEN_WIDTH - 40) / 4;

type ChildProps = {
  item: TTransactionsCategory;
  onPress: () => void;
};

function Child({ item, onPress }: ChildProps) {
  return (
    <TouchableHighlightComponent onPress={onPress}>
      <View style={[styles.itemChild, { width }]}>
        <SvgIcon name={item.icon} size={28} />
        <RNText numberOfLines={1}>{item.categoryName}</RNText>
      </View>
    </TouchableHighlightComponent>
  );
}
export default Child;
