import React, { memo, useCallback, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { useFormContext, useWatch } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TAccount } from 'database/types';
import { showToast } from 'utils/system';
import AccountList from './AccountList';
import InputSelection from 'components/InputSelection';
import BottomSheet from 'components/BottomSheetModal';
import { accountLocalQuery } from 'database/querying';

type AccountProp = {
  accountLogo: string;
  accountName: string;
};

type AccountSelectProps = {
  name?: string;
  title?: string;
  excludeId?: string;
  swapId?: string;
  subTitle?: string;
};

function AccountSelect({
  name = 'accountId',
  title = 'Chọn tài khoản',
  excludeId = '',
  swapId,
  subTitle = '',
}: AccountSelectProps) {
  const { control, setValue, getValues } = useFormContext<any>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [accountSelected, setAccountSelected] = useState<AccountProp | undefined>(undefined);

  const accountId = useWatch({
    control,
    name,
  });

  const handleOnSelectAccount = () => {
    bottomSheetModalRef.current?.present();
  };

  const fetchAccountData = async () => {
    if (!getValues(name)) {
      return false;
    }
    try {
      const account = await accountLocalQuery.getAccountById(getValues(name), [
        'accountLogo, accountName',
      ]);

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
    setValue(name, '');
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

  useFocusEffect(
    useCallback(() => {
      fetchAccountData();
    }, [accountId]),
  );

  return (
    <>
      <InputSelection
        required
        icon={accountSelected?.accountLogo}
        displayValue={accountSelected?.accountName}
        placeholder={title}
        subTitle={subTitle}
        fieldName={name}
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
