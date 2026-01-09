import React, { View } from 'react-native';
import { TAccount } from 'database/types';
import { useNavigation } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';
import { AccountParamListProps } from 'navigation/types';
import { formatNumber } from 'utils/math';
import styles from './styles';
import CheckboxComponent from 'components/Checkbox';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import RNText from 'components/Text';
import { ROUTES } from 'navigation/constants/routes';
import FastImage from '@d11/react-native-fast-image';

const unknownIcon = require('assets/images/default/unknown.png');

type ItemProps = {
  account: TAccount;
  isItemSelected?: string;
  onItemPress?: (account: TAccount) => void;
};

function Item({ account, isItemSelected, onItemPress }: ItemProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<AccountParamListProps['navigation']>();

  const handleOnItemPress = () => {
    if (onItemPress) {
      onItemPress(account);
    } else {
      const { id, accountName } = account;
      if (id) {
        navigation.navigate(ROUTES.ACCOUNT_NORMAL_DETAIL, { accountId: id, accountName });
      }
    }
  };

  return (
    <View style={[styles.itemContainer, { borderBottomColor: colors.divider }]}>
      <TouchableHighlightComponent
        style={{ backgroundColor: colors.surface }}
        onPress={handleOnItemPress}
      >
        <View style={styles.itemContent}>
          <FastImage
            style={styles.itemIcon}
            defaultSource={unknownIcon}
            source={{ uri: account.accountLogo }}
          />
          <View style={styles.itemCenter}>
            <RNText numberOfLines={1} style={styles.itemTitle}>
              {account.accountName}
            </RNText>
            <RNText numberOfLines={1} style={styles.itemSubTitle}>
              {formatNumber(account.closingAmount, true)}
            </RNText>
          </View>
          {isItemSelected && isItemSelected === account.id && (
            <CheckboxComponent check={true} disabled />
          )}
        </View>
      </TouchableHighlightComponent>
    </View>
  );
}
export default Item;
