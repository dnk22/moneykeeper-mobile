import React, { useCallback, useRef, useState } from 'react';
import { PressableHaptic, RNText, SvgIcon } from 'components/index';
import { View } from 'react-native';
import AccountList from 'features/AccountList';
import { useCustomTheme } from 'resources/theme';
import { useNavigation } from '@react-navigation/native';
import { ADD_ACCOUNT } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { TAccount } from 'database/types/index';
import ItemSettingsModal from './ItemSettingsModal';
import { selectAccountViewSettings } from 'store/app/app.selector';
import styles from './styles';

function Accounts() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { group } = useAppSelector((state) => selectAccountViewSettings(state));

  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const onToggleModal = () => {
    setIsShowItemSettingsModal(!isShowItemSettingsModal);
  };

  const handleOnCreateAccount = () => {
    navigation.navigate(ADD_ACCOUNT);
  };

  return (
    <>
      <ItemSettingsModal
        isVisible={isShowItemSettingsModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
      />
      <View style={styles.container}>
        <View style={styles.totalBalance}>
          <RNText style={styles.totalCurrency}>{'Tổng tiền:'}</RNText>
        </View>
        <AccountList title="Đang sử dụng" isGroup={group} onActionPress={onActionPress} />
        <AccountList title="Ngưng sử dụng" isDeactivate onActionPress={onActionPress} />
        <PressableHaptic
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleOnCreateAccount}
        >
          <SvgIcon name="add" size={30} color="white" />
        </PressableHaptic>
      </View>
    </>
  );
}

export default Accounts;
