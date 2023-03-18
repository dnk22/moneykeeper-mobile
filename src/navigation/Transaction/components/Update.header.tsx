import { useNavigation } from '@react-navigation/native';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SvgIcon, PressableHaptic } from 'components/index';
import { UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { useRoute } from '@react-navigation/native';

function UpdateTransactionCategoryHeader({}: HeaderButtonProps) {
  const navigation = useNavigation();
  const handleOnIconPress = () => {
    navigation.navigate(UPDATE_TRANSACTION_CATEGORY);
  };
  return (
    <PressableHaptic onPress={handleOnIconPress}>
      <SvgIcon name="pen" />
    </PressableHaptic>
  );
}
export default UpdateTransactionCategoryHeader;
