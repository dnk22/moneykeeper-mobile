import { useContext } from 'react';
import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import PressableHaptic from 'components/PressableHaptic';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import { AccountParamListProps } from 'navigation/types';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';
import { AccountContext } from 'features/account/AccountDashboard/context';
import { TAccount } from 'database/types';
import { More } from 'iconsax-react-native';
import ImageComponent from 'components/ImageComponent';
import styles from './styles';

type ItemProps = {
  account: TAccount;
};

function AccountItem({ account }: ItemProps) {
  const { colors } = useCustomTheme();
  const { onActionPress } = useContext(AccountContext);
  const navigation = useNavigation<AccountParamListProps['navigation']>();

  const onHandleItemPress = () => {
    const { id, accountName, accountTypeId } = account;
    if (!id) return;

    switch (accountTypeId) {
      case ACCOUNT_CATEGORY_ID.CREDITCARD:
        navigation.navigate(ROUTES.ACCOUNT_CREDIT_CARD_DETAIL, {
          accountId: id,
          accountName,
          initialAmount: account.closingAmount ?? 0,
        });
        break;
      default:
        navigation.navigate(ROUTES.ACCOUNT_NORMAL_DETAIL, { accountId: id, accountName });
        break;
    }
  };

  return (
    <TouchableHighlightComponent onPress={onHandleItemPress}>
      <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.itemContent}>
          <ImageComponent name={account.accountLogo} style={styles.itemIcon} />
          <RNText numberOfLines={1} fontSize={16} style={styles.itemTitle}>
            {account.accountName}
          </RNText>
          <PressableHaptic style={styles.itemAction} onPress={() => onActionPress(account)}>
            <More size="24" color={colors.text} />
          </PressableHaptic>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <View style={styles.itemFooter}>
          <RNText color={colors.textSecondary} fontSize={12}>
            Số dư hiện tại
          </RNText>
          <RNText
            numberOfLines={1}
            fontSize={14}
            style={styles.itemSubTitle}
            color={(account.closingAmount ?? 0) < 0 ? 'red' : colors.text}
          >
            {formatNumber(account.closingAmount, true)}
          </RNText>
        </View>
      </View>
    </TouchableHighlightComponent>
  );
}
export default AccountItem;
