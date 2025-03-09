import SvgIcon from 'components/SvgIcon';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { Button, View } from 'react-native';

function TransactionCategoryHeaderRight({ onPress, isUpdateMode, show }: any) {
  return (
    <View style={{ display: show ? 'flex' : 'none' }}>
      {isUpdateMode ? (
        <Button title="Hủy" onPress={onPress} />
      ) : (
        <TouchableHighlightComponent onPress={onPress}>
          <SvgIcon name="pen" />
        </TouchableHighlightComponent>
      )}
    </View>
  );
}
export default TransactionCategoryHeaderRight;
