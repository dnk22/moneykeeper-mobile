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

function AccountDetails() {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<
      AccountStackParamListProps<typeof CREATE_TRANSACTION_FROM_ACCOUNT>['navigation']
    >();
  const { params } = useRoute<AccountDetailProp>();

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
      <TransactionList />
    </View>
  );
}
export default AccountDetails;
