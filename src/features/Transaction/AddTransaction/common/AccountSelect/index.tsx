import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { isEqual } from 'lodash';
import { InputSelection, BottomSheet } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { getAccountById } from 'services/api/accounts';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TAccount } from 'database/types';
import AccountList from './AccountList';

type AccountProp = {
  accountLogo: string;
  accountName: string;
};

type AccountSelectProps = {
  name?: string;
  value?: string;
  control: any;
  error: any;
  onReset: () => void;
  setValue: any;
  title?: string;
  isShowSubTitle?: boolean;
  excludeId?: string;
};

function AccountSelect({
  name = 'accountId',
  value,
  control,
  error,
  onReset,
  setValue,
  title = 'Chọn tài khoản',
  isShowSubTitle,
  excludeId,
}: AccountSelectProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [accountSelected, setAccountSelected] = useState<AccountProp | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      fetchAccountData();
    }, [value]),
  );

  useEffect(() => {
    fetchAccountData();
  }, [value]);

  const handleOnSelectAccount = () => {
    bottomSheetModalRef.current?.present();
  };

  const fetchAccountData = async () => {
    if (!value) {
      return false;
    }
    try {
      const account = await getAccountById(value);
      if (!account) {
        resetAccountState();
        return false;
      }
      const newAccountState = {
        accountLogo: account.accountLogo,
        accountName: account.accountName,
      };
      // if data no change , don't setState
      if (!isEqual(newAccountState, accountSelected)) {
        setAccountSelected(newAccountState);
      }
      return true;
    } catch (error) {
      Alert.alert('Oops, Lỗi rồi!', 'Có lỗi trong quá trình chọn tài khoản');
      return false;
    }
  };

  const resetAccountState = () => {
    setAccountSelected(undefined);
    onReset();
  };

  const onAccountItemPress = (account: TAccount) => {
    setValue(name, account.id);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <>
      <InputSelection
        required
        isShowSubTitle={isShowSubTitle}
        icon={accountSelected?.accountLogo}
        value={accountSelected?.accountName}
        title={title}
        subTitle={title}
        name={name}
        control={control}
        error={error}
        onSelect={handleOnSelectAccount}
      />
      <BottomSheet ref={bottomSheetModalRef}>
        <AccountList
          excludeId={excludeId}
          isItemSelected={value}
          onItemPress={onAccountItemPress}
        />
      </BottomSheet>
    </>
  );
}
export default memo(AccountSelect);
