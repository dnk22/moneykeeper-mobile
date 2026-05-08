import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import AccountToolbar from '../components/AccountToolbar';
import HeaderIconButton from 'navigation/components/HeaderIconButton';
import { Add } from 'iconsax-react-native';
import { ROUTES } from 'navigation/constants/routes';
import { useCustomTheme } from 'resources/theme';

export default function userHeaderOptions({
  colors,
}: {
  colors: ReturnType<typeof useCustomTheme>['colors'];
}) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AccountToolbar />,
      headerRight: () => (
        <HeaderIconButton
          icon={<Add size={28} color={colors.text} />}
          onPress={() => navigation?.navigate(ROUTES.ADD_ACCOUNT as never)}
        />
      ),
    });
  }, [navigation]);
}
