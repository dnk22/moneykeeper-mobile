import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import PressableHaptic from 'components/PressableHaptic';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import SvgIcon from 'components/SvgIcon';
import { ADD_TRANSACTION, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AccountDetailProp } from 'navigation/types';

function AccountDetails() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<AccountDetailProp>();

  // set title screen
  useLayoutEffect(() => {
    navigation.setOptions({
      title: params?.accountName,
    });
  }, []);

  const handleOnCreateTransaction = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, {
      screen: ADD_TRANSACTION,
      params: { accountId: params?.accountId, hideHeader: true },
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
    </View>
  );
}
export default AccountDetails;
