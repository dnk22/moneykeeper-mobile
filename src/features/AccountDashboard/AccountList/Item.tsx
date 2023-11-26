import React, { View } from 'react-native';
import { TAccount } from 'database/types/index';
import { PressableHaptic, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { ACCOUNT_DETAIL } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { AccountStackParamListProps } from 'navigation/types';
import { formatNumber } from 'utils/math';
import styles from './styles';

type ItemProps = {
  account: TAccount;
  onActionPress?: (account: TAccount) => void;
};

function Item({ account, onActionPress }: ItemProps) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_DETAIL>['navigation']>();

  const handleOnItemPress = () => {
    const { id, accountName } = account;
    navigation.navigate(ACCOUNT_DETAIL, { accountId: id, accountName });
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightComponent
        style={{ backgroundColor: colors.surface }}
        onPress={handleOnItemPress}
      >
        <View style={styles.itemContent}>
          <SvgIcon name={account.accountLogo} size={34} />
          <View style={styles.itemCenter}>
            <RNText numberOfLines={1} style={styles.itemTitle}>
              {account.accountName}
            </RNText>
            <RNText numberOfLines={1} style={styles.itemSubTitle}>
              {formatNumber(account.closingAmount) + ' ₫'}
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
export default Item;
