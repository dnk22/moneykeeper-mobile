import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PressableHaptic from 'components/PressableHaptic';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import SvgIcon from 'components/SvgIcon';
import { ADD_TRANSACTION, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AccountDetailProp, AccountStackParamListProps } from 'navigation/types';
import Summary from './Summary';
import TransactionList from './TransactionList';
import { useEffect, useState } from 'react';
import { ButtonText, TransactionListByAccountConfig } from 'navigation/elements';

function TransactionListByAccount() {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<
      AccountStackParamListProps<typeof CREATE_TRANSACTION_FROM_ACCOUNT>['navigation']
    >();
  const { params } = useRoute<AccountDetailProp>();
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
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
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, {
      screen: ADD_TRANSACTION,
      params: { accountId: params?.accountId },
    });
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
