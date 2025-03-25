import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import InputSelection from 'components/InputSelection';
import { BankModel } from 'database/models';
import { ACCOUNT_CATEGORY_ID, BANK_TYPE } from 'utils/constants/account';
import { ROUTES } from 'navigation/constants/routes';
import { useFormContext, useWatch } from 'react-hook-form';
import { queryGetBankById } from 'database/querying';

function BankSection({ bankIdParam }: { bankIdParam?: string }) {
  const navigation = useNavigation<any>();
  const [selectedBank, setSelectedBank] = useState<BankModel | undefined>(undefined);
  const formMethods = useFormContext();
  const { control, setValue, trigger } = formMethods;

  useFocusEffect(
    useCallback(() => {
      setValue('bankId', bankIdParam);
    }, [bankIdParam]),
  );

  const accountType = useWatch({
    control,
    name: 'accountTypeId',
  });

  const bankId = useWatch({
    control,
    name: 'bankId',
  });

  useEffect(() => {
    setBankSelectedValue(bankId);
  }, [bankId, selectedBank]);

  const setBankSelectedValue = async (id?: string) => {
    if (!id) {
      setSelectedBank(undefined);
      return;
    }
    if (id && id !== selectedBank?.id) {
      const res = await queryGetBankById(id);
      if (res) {
        trigger('bankId');
        setValue('bankId', res.id);
        setValue('accountLogo', res.icon);
        setSelectedBank(res);
      }
    }
  };

  const getPlaceholder = useMemo(() => {
    switch (accountType) {
      case ACCOUNT_CATEGORY_ID.BANK:
      case ACCOUNT_CATEGORY_ID.CREDITCARD:
        return 'Chọn ngân hàng';
      default:
        return 'Chọn nhà cung cấp';
    }
  }, [accountType]);

  const handleSelectBank = () => {
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
    navigation.navigate(ROUTES.BANK_NAVIGATION, {
      screen: ROUTES.BANK_HOME_LIST,
      params: { type: bankType, returnScreen: ROUTES.ADD_ACCOUNT },
    });
  };

  return (
    <InputSelection
      required
      fieldName="bankId"
      icon={selectedBank?.icon}
      formMethods={formMethods}
      displayValue={selectedBank?.bankName}
      placeholder={getPlaceholder}
      onSelect={handleSelectBank}
    />
  );
}

export default BankSection;
