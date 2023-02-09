import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import styles from './styles';
import { TAccount } from 'types/models';
import { PressableHaptic, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { WALLET_DETAIL } from 'navigation/constants';

type ItemProps = {
  account: TAccount;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
};

function Item({ account, onActionPress, onItemPress }: ItemProps) {
  const navigation = useNavigation<any>();
  const handleOnItemPress = () => {
    if (onItemPress) {
      onItemPress(account);
      return;
    }
    const { _id } = account;
    navigation.navigate(WALLET_DETAIL, { accountId: _id });
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableHighlightComponent onPress={handleOnItemPress}>
        <View style={styles.itemContent}>
          <SvgIcon
            name={
              account?.provider_details?.icon ||
              account?.bank_details?.icon ||
              account?.account_type_details?.icon
            }
            size={30}
          />
          <View style={styles.itemCenter}>
            <RNText numberOfLines={1} style={styles.itemTitle}>
              {account.name}
            </RNText>
            <RNText numberOfLines={1} style={styles.itemSubTitle}>
              {account.current_amount?.toString()}
            </RNText>
          </View>
          <PressableHaptic
            style={styles.itemAction}
            onPress={() => onActionPress && onActionPress(account)}
          >
            <SvgIcon name="settingDot" size={20} />
          </PressableHaptic>
        </View>
      </TouchableHighlightComponent>
    </View>
  );
}
export default memo(Item, isEqual);
