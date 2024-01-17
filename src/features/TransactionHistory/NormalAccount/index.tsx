import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { PressableHaptic, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { ACCOUNT_NORMAL_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AccountStackParamListProps } from 'navigation/types';
import { ButtonText, TransactionListByAccountConfig } from 'navigation/elements';
import Summary from './Summary';
import TransactionList from './TransactionList';
import styles from './styles';

type NormalAccountProps = {
  navigation: AccountStackParamListProps<typeof ACCOUNT_NORMAL_DETAIL>['navigation'];
  route: AccountStackParamListProps<typeof ACCOUNT_NORMAL_DETAIL>['route'];
};

function NormalAccount({ navigation, route }: NormalAccountProps) {
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
          <TransactionListByAccountConfig onPressSelectMode={onHandleSelectMode} />
        ),
    });
  }, [isSelectMode]);

  const onHandleDeleteMultiTransaction = () => {};
  const onHandleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
  };

  const handleOnCreateTransaction = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { accountId: params?.accountId });
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
