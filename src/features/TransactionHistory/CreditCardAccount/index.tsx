import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { PressableHaptic, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { ACCOUNT_CREDIT_CARD_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AccountStackParamListProps } from 'navigation/types';
import { ButtonText, TransactionListByAccountConfig } from 'navigation/elements';
import { useAppSelector } from 'store/index';
import { selectAccountStatementList } from 'store/account/account.selector';
import { StatementViewProps } from 'utils/types';
import { TransactionHistoryContext } from './context';
import Summary from './Summary';
import StatementPicker from './StatementPicker';
import TransactionList from './TransactionList';
import styles from './styles';

type CreditCardAccountProps = {
  navigation: AccountStackParamListProps<typeof ACCOUNT_CREDIT_CARD_DETAIL>['navigation'];
  route: AccountStackParamListProps<typeof ACCOUNT_CREDIT_CARD_DETAIL>['route'];
};

function CreditCardAccount({ navigation, route }: CreditCardAccountProps) {
  const { params } = route;
  const { colors } = useCustomTheme();
  const statementList = useAppSelector((state) => selectAccountStatementList(state));

  const [refreshData, setRefreshData] = useState<number>(0);
  const [statement, setStatement] = useState<StatementViewProps>({});
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

  const onSelectStatement = (value: StatementViewProps) => {
    setStatement(value);
  };

  const onHandleDeleteMultiTransaction = () => {};

  const onHandleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
  };

  const handleOnCreateTransaction = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { accountId: params?.accountId });
  };

  const onRefreshData = () => {
    setRefreshData(refreshData + 1);
  };

  return (
    <View style={styles.container}>
      <TransactionHistoryContext.Provider
        value={{
          colors,
          refreshData,
          accountId: params.accountId,
          creditCardLimit: params.creditCardLimit,
          currentStatement: statement,
          statementList,
          onRefreshData,
        }}
      >
        <PressableHaptic
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleOnCreateTransaction}
        >
          <SvgIcon name="add" size={30} color="white" />
        </PressableHaptic>
        <Summary />
        <StatementPicker
          accountId={params.accountId}
          statementList={statementList}
          onChange={onSelectStatement}
        />
        <TransactionList />
      </TransactionHistoryContext.Provider>
    </View>
  );
}
export default CreditCardAccount;
