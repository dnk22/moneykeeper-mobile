import { useNavigation } from '@react-navigation/native';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { Button } from 'react-native';

function UpdateTransactionCategoryHeader({}: HeaderButtonProps) {
  const navigation = useNavigation();

  const handleOnIconPress = () => {
    navigation.navigate(UPDATE_TRANSACTION_CATEGORY);
  };
  return <Button title="Sửa" onPress={handleOnIconPress} />;
}
export default UpdateTransactionCategoryHeader;
