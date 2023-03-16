import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

function AccountDetails() {
  const navigation = useNavigation();
  const { params } = useRoute();
  
  useEffect(() => {
    // set title screen
    navigation.setOptions({
      title: params?.accountName,
    });
  }, []);

  return <View></View>;
}
export default AccountDetails;
