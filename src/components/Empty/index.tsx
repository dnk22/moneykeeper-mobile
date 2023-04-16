import { View } from 'react-native';
import RNText from '../Text';

function Empty({ text = 'Không có dữ liệu' }: { text?: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <RNText color="red">{text}</RNText>
    </View>
  );
}
export default Empty;
