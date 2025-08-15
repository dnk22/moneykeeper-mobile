import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import { useCustomTheme } from 'resources/theme';
import { ROUTES } from 'navigation/constants/routes';
import ButtonText from 'navigation/components/ButtonText';
import { AccountParamListProps } from 'navigation/types';
import Summary from './Summary';
import TransactionList from './TransactionList';
import HeaderBarConfig from '../HeaderBarConfig';
import styles from './styles';

function NormalAccount({
  navigation,
  route,
}: AccountParamListProps<typeof ROUTES.ACCOUNT_NORMAL_DETAIL>) {
  const { params } = route;
  const { colors } = useCustomTheme();
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Use `setOptions` to update the button that submit form
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isSelectMode ? (
          <ButtonText title="Xóa" onPress={onHandleDeleteMultiTransaction} />
        ) : (
          <HeaderBarConfig onPressSelectMode={onHandleSelectMode} />
        ),
    });
  }, [isSelectMode]);

  const onHandleDeleteMultiTransaction = () => {};
  const onHandleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
  };

  const handleOnCreateTransaction = () => {
    navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, { accountId: params?.accountId });
  };

  return (
    <View style={styles.container}>
      <PressableHaptic
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={handleOnCreateTransaction}
      >
        <SvgIcon name="add" size={30} color="white" />
      </PressableHaptic>
      <Summary accountId={params.accountId} />
      <TransactionList accountId={params.accountId} />
    </View>
  );
}
export default NormalAccount;
