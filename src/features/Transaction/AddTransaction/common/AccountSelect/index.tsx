import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { get, isEmpty, isEqual } from 'lodash';
import { InputSelection, BottomSheet } from 'components/index';
import { useFormContext } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { getAccountById } from 'services/api/accounts';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TAccount } from 'database/types';
import { showToast } from 'utils/system';
import AccountList from './AccountList';

type AccountProp = {
  accountLogo: string;
  accountName: string;
};

type AccountSelectProps = {
  name?: string;
  onReset: () => void;
  title?: string;
  isShowSubTitle?: boolean;
  excludeId?: string;
  swapId?: string;
};

function AccountSelect({
  name = 'accountId',
  title = 'Chọn tài khoản',
  onReset,
  isShowSubTitle,
  excludeId = '',
  swapId,
}: AccountSelectProps) {
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<any>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [accountSelected, setAccountSelected] = useState<AccountProp | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      fetchAccountData();
    }, [watch(name)]),
  );

  useEffect(() => {
    fetchAccountData();
  }, [watch(name)]);

  const handleOnSelectAccount = () => {
    bottomSheetModalRef.current?.present();
  };

  const fetchAccountData = async () => {
    if (!getValues(name)) {
      return false;
    }
    try {
      const account = await getAccountById(getValues(name), false);
      if (isEmpty(account)) {
        resetAccountState();
        return false;
      }
      // if data no change , don't setState
      if (!isEqual(account, accountSelected)) {
        setAccountSelected(account);
      }
    } catch (error) {
      showToast({
        type: 'error',
      });
    }
  };

  const resetAccountState = () => {
    setAccountSelected(undefined);
    onReset();
  };

  const onAccountItemPress = (account: TAccount) => {
    if (swapId && account.id === getValues(swapId)) {
      setValue(swapId, getValues(name));
      setValue(name, account.id);
    } else {
      setValue(name, account.id);
    }
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
        error={get(errors, name)}
        onSelect={handleOnSelectAccount}
      />
      <BottomSheet ref={bottomSheetModalRef}>
        <AccountList
          excludeId={getValues(excludeId)}
          isItemSelected={getValues(name)}
          onItemPress={onAccountItemPress}
        />
      </BottomSheet>
    </>
  );
}
export default memo(AccountSelect, isEqual);
