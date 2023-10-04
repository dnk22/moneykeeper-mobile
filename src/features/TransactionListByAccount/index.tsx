import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PressableHaptic, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AccountStackParamListProps } from 'navigation/types';
import { ButtonText, TransactionListByAccountConfig } from 'navigation/elements';
import Summary from './Summary';
import TransactionList from './TransactionList';
import styles from './styles';

function TransactionListByAccount() {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<
      AccountStackParamListProps<typeof CREATE_TRANSACTION_FROM_ACCOUNT>['navigation']
    >();
  const { params } =
    useRoute<AccountStackParamListProps<typeof CREATE_TRANSACTION_FROM_ACCOUNT>['route']>();
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
      <Summary />
      <TransactionList accountId={params.accountId} />
    </View>
  );
}
export default TransactionListByAccount;
