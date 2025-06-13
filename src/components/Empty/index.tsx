import { View } from 'react-native';
import RNText from '../Text';

function Empty({
  title = 'Chưa có dữ liệu',
  subTitle,
  styles = {},
}: {
  title?: string;
  subTitle?: string;
  styles?: any;
}) {
  return (
    <View style={[{ alignItems: 'center', gap: 10 }, styles]}>
      <RNText preset="emptyText">{title}</RNText>
      <RNText preset="subTitle" numberOfLines={2}>
        {subTitle}
      </RNText>
    </View>
  );
}
export default Empty;
