import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import InputSelection from 'components/InputSelection';
import { BankModel } from 'database/models';
import { BANK_HOME_LIST, BANK_NAVIGATION } from 'navigation/constants';
import { ACCOUNT_CATEGORY_ID, BANK_TYPE } from 'utils/constant';
import { getBankById } from 'services/api/banks';

type AccountBankSelectProps = {
  accountType: ACCOUNT_CATEGORY_ID;
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
      case ACCOUNT_CATEGORY_ID.INVESTMENT:
        bankType = BANK_TYPE.INVESTMENT;
        break;
      case ACCOUNT_CATEGORY_ID.EWALLET:
        bankType = BANK_TYPE.WALLET;
        break;
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
      case ACCOUNT_CATEGORY_ID.BANK:
      case ACCOUNT_CATEGORY_ID.CREDITCARD:
        return 'Chọn ngân hàng';
      default:
        return 'Chọn nhà cung cấp';
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
      defaultIcon="bankDefault"
      value={bankSelectedState?.bankName}
      title={getInputBankPlaceHolder()}
      onSelect={onSelectBank}
      onDelete={resetSelectedBank}
    />
  );
}

export default AccountBankSelect;
