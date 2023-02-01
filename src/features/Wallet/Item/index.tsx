import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import styles from './styles';
import { TAccount } from 'types/models';
import { PressableHaptic, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';

type ItemProps = {
  account: TAccount;
  onActionPress: (account: TAccount) => void;
};

function Item({ account, onActionPress }: ItemProps) {
  const onItemPress = () => {};

  return (
    <View style={styles.touch}>
      <TouchableHighlightComponent onPress={onItemPress}>
        <View style={styles.container}>
          <View style={styles.content}>
            <SvgIcon
              name={account?.icon?.provider || account?.icon?.bank || account?.icon?.accountType}
              size={30}
            />
            <View style={{ flex: 1, rowGap: 5 }}>
              <RNText numberOfLines={1} style={styles.accountName}>
                {account.name}
              </RNText>
              <RNText numberOfLines={1} style={styles.accountAmount}>
                {account.current_amount?.toString()}
              </RNText>
            </View>
          </View>
          <PressableHaptic style={styles.action} onPress={() => onActionPress(account)}>
            <SvgIcon name="settingDot" size={20} />
          </PressableHaptic>
        </View>
      </TouchableHighlightComponent>
    </View>
  );
}
export default memo(Item, isEqual);
