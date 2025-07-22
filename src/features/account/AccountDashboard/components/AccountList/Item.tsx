import { useContext } from 'react';
import React, { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import PressableHaptic from 'components/PressableHaptic';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import { AccountStackNavigationProps } from 'navigation/types';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';
import { AccountContext } from 'features/account/AccountDashboard/context';
import { TAccount } from 'database/types';
import { accountListStyles as styles } from '../../styles';
import FastImage from 'react-native-fast-image';
import { Settings } from 'iconsax-react-native';

type ItemProps = {
  account: TAccount;
  transparentBackground?: boolean;
};

function AccountItem({ account, transparentBackground }: ItemProps) {
  const { colors } = useCustomTheme();
  const { onActionPress } = useContext(AccountContext);
  const navigation = useNavigation<AccountStackNavigationProps>();

  const onHandleItemPress = () => {
    const { id, accountName, accountTypeId } = account;
    if (!id) return;

    switch (accountTypeId) {
      case ACCOUNT_CATEGORY_ID.CREDITCARD:
        navigation.navigate(ROUTES.ACCOUNT_CREDIT_CARD_DETAIL, {
          accountId: id,
          accountName,
        });
        break;
      default:
        navigation.navigate(ROUTES.ACCOUNT_NORMAL_DETAIL, { accountId: id, accountName });
        break;
    }
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightComponent
        style={{ backgroundColor: transparentBackground ? undefined : colors.surface }}
        onPress={onHandleItemPress}
      >
        <View style={styles.itemContent}>
          <FastImage source={{ uri: account.accountLogo }} style={styles.itemIcon} />
          <View style={styles.itemCenter}>
            <RNText numberOfLines={1} fontSize={16} style={styles.itemTitle}>
              {account.accountName}
            </RNText>
            <RNText
              numberOfLines={1}
              fontSize={13}
              style={styles.itemSubTitle}
              color={account.closingAmount < 0 ? 'red' : colors.text}
            >
              {formatNumber(account.closingAmount, true)}
            </RNText>
          </View>
          <PressableHaptic
            style={styles.itemAction}
            onPress={() => onActionPress && onActionPress(account)}
          >
            <Settings size="26" color={colors.text} />
          </PressableHaptic>
        </View>
      </TouchableHighlightComponent>
    </View>
  );
}
export default AccountItem;
