import { useNavigation } from '@react-navigation/native';
import { TAccount } from 'database/types';
import { ROUTES } from 'navigation/constants/routes';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ACCOUNT_TYPE_LIST, ADD_ACCOUNT_DEFAULT_VALUES } from 'utils/constants/account';
import { formatDataBeforeSubmit, formatDataDetail } from './utility';
import { requestDeleteAccount, requestUpdateAccount } from 'services/api/accounts';
import { useAppDispatch } from 'store/index';
import { showToast } from 'utils/system';
import { Alert, Button } from 'react-native';
import { accountLocalQuery } from 'database/querying';
import { updateAppLoading } from 'store/app/app.slice';

const useFormHooks = (accountId?: string) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const methods = useForm<TAccount>({
    defaultValues: ADD_ACCOUNT_DEFAULT_VALUES,
    reValidateMode: 'onChange',
  });
  const { control, handleSubmit, getValues, reset } = methods;

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

  const onOkDelete = () => {
    const { id } = getValues();
    if (id) {
      requestDeleteAccount(id)
        .then(() => {
          showToast({
            type: 'success',
            text2: 'Xóa tài khoản thành công',
          });
          goBack();
        })
        .catch((error) => {
          showToast({
            type: 'error',
            text2: 'Vui lòng thử lại',
          });
        });
    }
  };

  const onConfirmDeleteAccount = () =>
    Alert.alert(
      `Xóa [ ${getValues('accountName')} ]`,
      'Xóa tài khoản đồng này nghĩa với việc tất cả các ghi chép của tài khoản này và các tài khoản liên quan sẽ bị xóa theo, HÃY CẨN THẬN!',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        { text: 'Đồng ý', style: 'destructive', onPress: () => onOkDelete() },
      ],
    );

  const handleFormSubmit = (data: TAccount) => {
    dispatch(updateAppLoading(true));
    const requestData = formatDataBeforeSubmit(data);
    requestUpdateAccount(requestData)
      .then(() => {
        dispatch(updateAppLoading(false));
        goBack();
      })
      .catch((error) => {
        showToast({
          type: 'error',
          text2: 'Vui lòng thử lại.',
        });
      });
  };

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
    if (accountId) {
      accountLocalQuery.getAccountById(accountId).then((account) => {
        if (account) {
          const formattedData = formatDataDetail({ ...ADD_ACCOUNT_DEFAULT_VALUES, ...account });
          reset(formattedData);
        }
      });
    }
  }, [accountId]);

  return {
    methods,
    isCreditCard,
    accountTypeId,
    onFormSubmit: handleSubmit(handleFormSubmit),
    onConfirmDeleteAccount,
  };
};

export default useFormHooks;
