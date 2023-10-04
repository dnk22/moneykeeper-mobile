import { View } from 'react-native';
import styles from './styles';
import { TAccount } from 'database/types/index';
import {
  CheckboxComponent,
  PressableHaptic,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { ACCOUNT_DETAIL } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { AccountStackParamListProps } from 'navigation/types';

type ItemProps = {
  account: TAccount;
  isItemSelected?: string;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
};

function Item({ account, isItemSelected, onActionPress, onItemPress }: ItemProps) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_DETAIL>['navigation']>();

  const handleOnItemPress = () => {
    if (onItemPress) {
      onItemPress(account);
    } else {
      const { id, accountName } = account;
      navigation.navigate(ACCOUNT_DETAIL, { accountId: id, accountName });
    }
  };

  return (
    <View style={[styles.itemContainer, { borderBottomColor: colors.divider }]}>
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
              {account.currentAmount?.toString()}
            </RNText>
          </View>
          {isItemSelected && isItemSelected === account.id && (
            <CheckboxComponent check={true} disabled />
          )}
          {!isItemSelected && !onItemPress && (
            <PressableHaptic
              style={styles.itemAction}
              onPress={() => onActionPress && onActionPress(account)}
            >
              <SvgIcon name="settingDot" />
            </PressableHaptic>
          )}
        </View>
      </TouchableHighlightComponent>
    </View>
  );
}
export default Item;
