import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import InputSelection from 'components/InputSelection';
import { isEqual } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import { getAccountById } from 'services/api/accounts';
import AccountList from 'features/AccountList';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';

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
}: AccountSelectProps) {
  const { colors } = useCustomTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [accountSelected, setAccountSelected] = useState<AccountProp | undefined>(undefined);
  const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);

  useFocusEffect(
    useCallback(() => {
      fetchAccountData();
    }, [value]),
  );

  useEffect(() => {
    fetchAccountData();
  }, [value]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />;
  }, []);

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
    setValue('accountId', account.id);
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}>
          <AccountList isItemSelected={value} isGroup onItemPress={onAccountItemPress} />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
export default memo(AccountSelect);
