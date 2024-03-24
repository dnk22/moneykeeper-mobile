import React, { View } from 'react-native';
import { TAccount } from 'database/types';
import {
  IconComponent,
  PressableHaptic,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { ACCOUNT_NORMAL_DETAIL, ACCOUNT_CREDIT_CARD_DETAIL } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { AccountStackParamListProps } from 'navigation/types';
import { formatNumber } from 'utils/math';
import { ACCOUNT_CATEGORY_ID } from 'utils/constant';
import styles from './styles';

type ItemProps = {
  account: TAccount;
  transparentBackground?: boolean;
  onActionPress?: (account: TAccount) => void;
};

function AccountItem({ account, transparentBackground, onActionPress }: ItemProps) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_NORMAL_DETAIL>['navigation']>();

  const handleOnItemPress = () => {
    const { id, accountName, accountTypeId, creditCardLimit } = account;
    switch (accountTypeId) {
      case ACCOUNT_CATEGORY_ID.CREDITCARD:
        navigation.navigate(ACCOUNT_CREDIT_CARD_DETAIL, {
          accountId: id,
          accountName,
          creditCardLimit,
        });
        break;
      default:
        navigation.navigate(ACCOUNT_NORMAL_DETAIL, { accountId: id, accountName });
        break;
    }
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightComponent
        style={{ backgroundColor: transparentBackground ? undefined : colors.surface }}
        onPress={handleOnItemPress}
      >
        <View style={styles.itemContent}>
          <IconComponent name={account.accountLogo} />
          <View style={styles.itemCenter}>
            <RNText numberOfLines={1} fontSize={16} style={styles.itemTitle}>
              {account.accountName}
            </RNText>
            <RNText
              numberOfLines={1}
              fontSize={13}
              style={styles.itemSubTitle}
              color={account?.closingAmount < 0 ? 'red' : colors.text}
            >
              {formatNumber(account?.closingAmount, true)}
            </RNText>
          </View>
          <PressableHaptic
            style={styles.itemAction}
            onPress={() => onActionPress && onActionPress(account)}
          >
            <SvgIcon name="settingDot" />
          </PressableHaptic>
        </View>
      </TouchableHighlightComponent>
    </View>
  );
}
export default AccountItem;
