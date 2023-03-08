import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, PressableHaptic, RNText, SvgIcon } from 'components/index';
import { View, SectionListData } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ADD_ACCOUNT } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { TAccount } from 'database/types/index';
import ItemSettingsModal from './ItemSettingsModal';
import { selectAccountViewSettings } from 'store/app/app.selector';
import AccountList from '../AccountList';
import { groupDataByValue } from 'utils/algorithm';
import { getActiveAccountObserve } from 'database/querying/accounts.query';
import withObservables from '@nozbe/with-observables';
import { AccountModel } from 'database/models';
import { Observable } from '@nozbe/watermelondb/utils/rx';

type AccountProps = {
  activeAccountsObservables: Observable<AccountModel[]>;
  deactivateAccountsObservables: Observable<AccountModel[]>;
};
function Accounts({ activeAccountsObservables, deactivateAccountsObservables }: AccountProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  const { group } = useAppSelector((state) => selectAccountViewSettings(state));

  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);
  const [activeAccounts, setActiveAccounts] = useState<SectionListData<TAccount, any>>([]);

  useEffect(() => {
    fetchActiveAccount();
  }, [group, activeAccountsObservables]);

  const fetchActiveAccount = async () => {
    if (group) {
      const dataGroup: any[] = groupDataByValue(activeAccountsObservables);
      setActiveAccounts(dataGroup);
    } else {
      setActiveAccounts([{ data: activeAccountsObservables, title: '' }]);
    }
  };

  const getTotalAmount = useCallback((data: TAccount[]) => {
    const result = data.reduce((sum, account) => sum + account.currentAmount, 0);
    return result;
  }, []);

  const renderTitle = useCallback(
    (title: string, value: TAccount[]) => {
      return `${title}${getTotalAmount(value)} ₫`;
    },
    [getTotalAmount],
  );

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const isHaveAccountsData = useMemo(
    () => !!activeAccounts.length || !!deactivateAccountsObservables.length,
    [activeAccounts, deactivateAccountsObservables],
  );

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
        {isHaveAccountsData && (
          <View style={styles.totalBalance}>
            <RNText style={styles.totalCurrency}>
              {renderTitle('Tổng tiền: ', activeAccounts)}
            </RNText>
          </View>
        )}
        {!!activeAccounts.length && (
          <Card title={renderTitle('Đang sử dụng: ', activeAccounts)}>
            <AccountList data={activeAccounts} isGroup={group} onActionPress={onActionPress} />
          </Card>
        )}
        {!!deactivateAccountsObservables.length && (
          <Card title="Ngưng sử dụng">
            <AccountList
              data={[{ data: deactivateAccountsObservables }]}
              isGroup={false}
              onActionPress={onActionPress}
            />
          </Card>
        )}
        {!isHaveAccountsData && (
          <View style={styles.noAccounts}>
            <RNText>Không có tài khoản nào!</RNText>
          </View>
        )}
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

export default withObservables([], () => ({
  activeAccountsObservables: getActiveAccountObserve(true),
  deactivateAccountsObservables: getActiveAccountObserve(false),
}))<any>(Accounts);
