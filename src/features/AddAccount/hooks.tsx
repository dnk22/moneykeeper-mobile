import { useNavigation } from '@react-navigation/native';
import { TAccount } from 'database/types';
import { ROUTES } from 'navigation/constants/routes';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  ACCOUNT_CATEGORY_ID,
  ACCOUNT_TYPE_LIST,
  ADD_ACCOUNT_DEFAULT_VALUES,
} from 'utils/constants/account';
import { formatAccountData } from './utility';
import { requestDeleteAccount, requestUpdateAccount } from 'services/api/accounts';
import { useAppDispatch } from 'store/index';
import { removeAccountStatement, updateAccountStatement } from 'store/account/account.slice';
import { showToast } from 'utils/system';
import { Alert, Button } from 'react-native';
import { queryAccountById } from 'database/querying';

const useFormHooks = (accountId?: string) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const methods = useForm<TAccount>({
    defaultValues: ADD_ACCOUNT_DEFAULT_VALUES,
    reValidateMode: 'onSubmit',
  });
  const { control, handleSubmit, getValues, reset, setValue } = methods;

  const isCreditCard =
    useWatch({
      control,
      name: 'accountTypeId',
    }) === ACCOUNT_TYPE_LIST[2].id;

  const accountTypeId = useWatch({
    control,
    name: 'accountTypeId',
  });

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(ROUTES.ACCOUNT_TAB);
    }
  };

  const handleFormSubmit = (data: TAccount) => {
    const requestData = formatAccountData(data);
    requestUpdateAccount({ id: data?.id, account: requestData })
      .then((accountId: string) => {
        // check notifications in credit card account
        if (requestData.accountTypeId === ACCOUNT_CATEGORY_ID.CREDITCARD) {
          dispatch(
            updateAccountStatement({
              [accountId]: {
                statementDate: requestData.creditCardStatementDay,
                paymentDate: requestData.creditCardDayAfterStatement,
                isReminder: requestData.creditCardIsReminder,
                reminderList: requestData.creditCardReminderList,
              },
            }),
          );
        } else {
          dispatch(removeAccountStatement(accountId));
        }
        goBack();
      })
      .catch(({ error }) => {
        showToast({
          type: 'error',
          text2: error,
        });
      });
  };

  const onOkDelete = () => {
    const { id } = getValues();
    if (id) {
      requestDeleteAccount(id)
        .then(() => {
          showToast({
            type: 'success',
            text2: 'Xóa tài khoản thành công',
          });
          dispatch(removeAccountStatement(id));
          goBack();
        })
        .catch(() => {
          showToast({
            type: 'error',
          });
        });
    }
  };

  const onConfirmDeleteAccount = () =>
    Alert.alert(
      `Xóa ${getValues('accountName')}`,
      'Xóa tài khoản đồng này nghĩa với việc tất cả các ghi chép của tài khoản này và các tài khoản liên quan sẽ bị xóa theo, HÃY CẨN THẬN!',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        { text: 'Đồng ý', style: 'destructive', onPress: () => onOkDelete() },
      ],
    );

  useEffect(() => {
    if (accountId) {
      queryAccountById(accountId).then((account) => {
        if (account) {
          reset({
            ...ADD_ACCOUNT_DEFAULT_VALUES,
            ...account,
            accountTypeId: account.accountTypeId || ACCOUNT_TYPE_LIST[0].id,
          });
        }
      });
    }
  }, [accountId]);

  // Use `setOptions` to update account
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Lưu" onPress={handleSubmit(handleFormSubmit)} color="white" />
      ),
    });
    return () => {
      navigation.setOptions({
        headerRight: undefined,
      });
    };
  }, []);

  useEffect(() => {
    // Reset credit card fields if account type is not credit card
    setValue('creditCardLimit', 0);
    setValue('initialAmount', 0);
  }, [isCreditCard]);

  return {
    methods,
    isCreditCard,
    accountTypeId,
    onFormSubmit: handleSubmit(handleFormSubmit),
    onConfirmDeleteAccount,
  };
};

export default useFormHooks;
// This file contains the custom hooks for the AddAccount feature.