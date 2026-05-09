import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import AccountToolbar from '../components/AccountToolbar';
import HeaderIconButton from 'navigation/components/HeaderIconButton';
import { Add } from 'iconsax-react-native';
import { ROUTES } from 'navigation/constants/routes';

export default function userHeaderOptions({
  colors,
  pageIndex,
}: {
  colors: any;
  pageIndex: number;
}) {
  const navigation = useNavigation();

  const handleAddAccount = () => {
    navigation.navigate(ROUTES.ADD_ACCOUNT as never);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AccountToolbar pageIndex={pageIndex} />,
    });
  }, [pageIndex]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderIconButton icon={<Add size={28} color={colors.text} />} onPress={handleAddAccount} />
      ),
    });
  }, [colors.text]);
}
