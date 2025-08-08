import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import InputSelection from 'components/InputSelection';
import { ACCOUNT_CATEGORY_ID, ACCOUNT_TYPE_LIST, BANK_TYPE } from 'utils/constants/account';
import { ROUTES } from 'navigation/constants/routes';
import { useFormContext, useWatch } from 'react-hook-form';
import { fetchBankList } from 'services/api/banks';
import { TBank } from 'database/types';

function BankSection({ bankIdParam }: { bankIdParam?: string }) {
  const navigation = useNavigation<any>();
  const [bankList, setBankList] = useState<{ [key: string]: TBank }>({});
  const formMethods = useFormContext();
  const { control, setValue, getValues } = formMethods;

  const accountType = useWatch({
    control,
    name: 'accountTypeId',
  });

  const bankType = useMemo(() => {
    switch (accountType) {
      case ACCOUNT_CATEGORY_ID.INVESTMENT:
        return BANK_TYPE.INVESTMENT;
      case ACCOUNT_CATEGORY_ID.EWALLET:
        return BANK_TYPE.WALLET;
      default:
        return BANK_TYPE.BANK;
    }
  }, [accountType]);

  const bankId: string = useWatch({
    control,
    name: 'bankId',
  });

  const currentBank = useMemo(() => {
    if (bankId && bankList[bankId]) {
      return bankList[bankId];
    }
    return null;
  }, [bankId, bankList]);

  const getAllBanks = async () => {
    const { data = [] } = await fetchBankList({ type: bankType });
    if (data.length !== 0) {
      const newBankList = data.reduce<{ [key: string]: TBank }>((acc, bank) => {
        acc[bank.id] = bank;
        return acc;
      }, {});
      setBankList(newBankList);
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
    navigation.navigate(ROUTES.BANK_NAVIGATION, {
      screen: ROUTES.BANK_HOME_LIST,
      params: { type: bankType, returnScreen: ROUTES.ADD_ACCOUNT },
    });
  };

  const handleDeleteBank = () => {
    setValue('bankId', '');
    setValue('accountLogo', ACCOUNT_TYPE_LIST[getValues('accountTypeId')].icon);
  };

  useEffect(() => {
    getAllBanks();
  }, [bankType]);

  useFocusEffect(
    useCallback(() => {
      if (bankIdParam) {
        setValue('bankId', bankIdParam);
        setValue('accountLogo', bankList[bankIdParam].icon);
        navigation.dispatch({
          ...CommonActions.setParams({ bankId: '' }),
        });
      }
    }, [bankIdParam]),
  );

  return (
    <InputSelection
      fieldName="bankId"
      iconName={currentBank?.icon}
      displayValue={currentBank?.bankName}
      placeholder={getPlaceholder}
      onSelect={handleSelectBank}
      onDelete={handleDeleteBank}
    />
  );
}

export default BankSection;
