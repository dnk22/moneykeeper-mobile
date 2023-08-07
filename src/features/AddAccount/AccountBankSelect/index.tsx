import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import InputSelection from 'components/InputSelection';
import { BankModel } from 'database/models';
import { BANK_HOME_LIST, BANK_NAVIGATION } from 'navigation/constants';
import { getBankById } from 'database/querying';
import { BANK_TYPE } from 'utils/constant';

type AccountBankSelectProps = {
  accountType: string;
  value?: string;
  onDelete: () => void;
  onValueChange: (bank: BankModel) => void;
};
function AccountBankSelect({
  accountType,
  value,
  onValueChange,
  onDelete,
}: AccountBankSelectProps) {
  const navigation = useNavigation<any>();

  const [bankSelectedState, setBankSelectedState] = useState<BankModel | undefined>(undefined);

  useEffect(() => {
    if (value) {
      setBankSelectedValue(value);
    } else {
      resetSelectedBank();
    }
  }, [value]);

  const onSelectBank = () => {
    let bankType = BANK_TYPE.BANK;
    switch (accountType) {
      case '3':
        bankType = BANK_TYPE.INVESTMENT;
      case '4':
        bankType = BANK_TYPE.WALLET;
      default:
        break;
    }
    navigation.navigate(BANK_NAVIGATION, {
      screen: BANK_HOME_LIST,
      params: { type: bankType },
    });
  };

  const getInputBankPlaceHolder = () => {
    switch (accountType) {
      case '4':
        return 'Chọn nhà cung cấp';
      default:
        return 'Chọn ngân hàng';
    }
  };

  const setBankSelectedValue = async (id?: string) => {
    if (id && id !== bankSelectedState?.id) {
      const res = await getBankById(id);
      if (res) {
        setBankSelectedState(res);
        onValueChange && onValueChange(res);
      }
    }
  };

  const resetSelectedBank = () => {
    setBankSelectedState(undefined);
    onDelete && onDelete();
  };

  return (
    <InputSelection
      icon={bankSelectedState?.icon}
      value={bankSelectedState?.bankName}
      title={getInputBankPlaceHolder()}
      onSelect={onSelectBank}
      onDelete={resetSelectedBank}
    />
  );
}

export default AccountBankSelect;
