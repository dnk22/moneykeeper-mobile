import SvgIcon from 'components/SvgIcon';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { Button, View } from 'react-native';

function UpdateTransactionCategoryHeader({ onPress, isUpdateMode, show }: any) {
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
export default UpdateTransactionCategoryHeader;
