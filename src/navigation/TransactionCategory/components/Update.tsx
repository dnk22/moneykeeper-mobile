import SvgIcon from 'components/SvgIcon';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { Button } from 'react-native';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectUpdateModeStatus } from 'store/transactionCategory/transactionCategory.selector';
import { toggleUpdateMode } from 'store/transactionCategory/transactionCategory.slice';

function UpdateTransactionCategoryHeader() {
  const useDispatch = useAppDispatch();
  const isUpdateMode = useAppSelector((state) => selectUpdateModeStatus(state));

  const handleOnIconPress = () => {
    useDispatch(toggleUpdateMode(!isUpdateMode));
  };
  return (
    <>
      {isUpdateMode ? (
        <Button title="Hủy" onPress={handleOnIconPress} />
      ) : (
        <TouchableHighlightComponent onPress={handleOnIconPress}>
          <SvgIcon name="pen" />
        </TouchableHighlightComponent>
      )}
    </>
  );
}
export default UpdateTransactionCategoryHeader;
