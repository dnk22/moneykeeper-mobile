import TouchableHighlightComponent from 'components/TouchableHighlight';
import { Edit } from 'iconsax-react-native';
import { Button, View } from 'react-native';

function TransactionCategoryHeaderRight({ onPress, isUpdateMode, show }: any) {
  return (
    <View style={{ display: show ? 'flex' : 'none' }}>
      {isUpdateMode ? (
        <Button title="Hủy" onPress={onPress} />
      ) : (
        <TouchableHighlightComponent onPress={onPress}>
          <Edit size="28" color="#FF8A65"/>
        </TouchableHighlightComponent>
      )}
    </View>
  );
}
export default TransactionCategoryHeaderRight;
