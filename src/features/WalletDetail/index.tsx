import { View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useAppSelector } from 'store/index';
import { selectAccountById } from 'store/account/account.selector';
import { useEffect } from 'react';

type WalletDetailProps = {
  navigation: NavigationProp<Record<string, object | undefined>, string>;
  route: RouteProp<Record<string, object | undefined>, string>;
};
function WalletDetail({ navigation, route }: WalletDetailProps) {
  const { params } = route;
  const getAccountById = useAppSelector((state) => selectAccountById(state, params?.accountId));

  useEffect(() => {
    // set title screen
    navigation.setOptions({
      title: getAccountById?.name,
    });
  }, [getAccountById]);

  return <View></View>;
}
export default WalletDetail;
