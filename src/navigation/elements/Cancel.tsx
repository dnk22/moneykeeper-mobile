import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';

function Cancel() {
  const navigation = useNavigation();
  const onCancel = () => {
    navigation.goBack();
  };
  return <Button title="Hủy" onPress={onCancel}></Button>;
}

export default Cancel;
