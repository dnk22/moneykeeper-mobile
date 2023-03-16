import { View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';

type WalletDetailProps = {
  navigation: NavigationProp<Record<string, object | undefined>, string>;
  route: RouteProp<Record<string, object | undefined>, string>;
};
function AccountDetails({ navigation, route }: WalletDetailProps) {
  const { params } = route;

  useEffect(() => {
    // set title screen
    navigation.setOptions({
      title: 'hihi',
    });
  }, []);

  return <View></View>;
}
export default AccountDetails;
