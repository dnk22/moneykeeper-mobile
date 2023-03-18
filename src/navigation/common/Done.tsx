import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';

function Done() {
  const navigation = useNavigation();
  const onCancel = () => {
    navigation.goBack();
  };
  return <Button title="Xong" color="white" onPress={onCancel}></Button>;
}

export default Done;
