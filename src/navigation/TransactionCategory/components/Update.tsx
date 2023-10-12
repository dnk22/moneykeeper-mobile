import SvgIcon from 'components/SvgIcon';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { Button } from 'react-native';

function UpdateTransactionCategoryHeader({ onPress, isUpdateMode }: any) {
  return (
    <>
      {isUpdateMode ? (
        <Button title="Hủy" onPress={onPress} />
      ) : (
        <TouchableHighlightComponent onPress={onPress}>
          <SvgIcon name="pen" />
        </TouchableHighlightComponent>
      )}
    </>
  );
}
export default UpdateTransactionCategoryHeader;
