import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { ROUTES } from 'navigation/constants/routes';
import { AccountStackNavigationProps, AccountStackRouteProps } from 'navigation/types';
import ButtonText from 'navigation/components/ButtonText';
import { useAppSelector } from 'store/index';
import { selectAccountStatementList } from 'store/account/account.selector';
import { StatementViewProps } from 'utils/types';
import { TransactionHistoryContext } from './context';
import Summary from './Summary';
import StatementPicker from './StatementPicker';
import TransactionList from './TransactionList';
import HeaderBarConfig from '../HeaderBarConfig';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import styles from './styles';

type CreditCardAccountProps = {
  navigation: AccountStackNavigationProps;
  route: AccountStackRouteProps<typeof ROUTES.ACCOUNT_CREDIT_CARD_DETAIL>;
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
          <HeaderBarConfig onPressSelectMode={onHandleSelectMode} />
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
    navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, { accountId: params?.accountId });
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
          currentStatement: statement,
          statementInfo: statementList[params.accountId],
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
        <StatementPicker onChange={onSelectStatement} />
        <TransactionList />
      </TransactionHistoryContext.Provider>
    </View>
  );
}
export default CreditCardAccount;
