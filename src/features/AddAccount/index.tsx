import React, { useEffect } from 'react';
import { Alert, Button, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputCalculator from 'features/AddTransaction/common/InputCalculator';

import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { requestDeleteAccount, requestUpdateAccount } from 'services/api/accounts';
import { showToast } from 'utils/system';

import SvgIcon from 'components/SvgIcon';
import InputField from 'components/InputField';
import FormAction from 'components/common/FormAction';
import SwitchField from 'components/Switch/SwitchField';
import RNText from 'components/Text';
import {
  ACCOUNT_CATEGORY_ID,
  ACCOUNT_TYPE_LIST,
  ADD_ACCOUNT_DEFAULT_VALUES,
} from 'utils/constants/account';
import { removeAccountStatement, updateAccountStatement } from 'store/account/account.slice';
import { useAppDispatch } from 'store/index';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { AccountStackRouteProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import AccountTypeSection from './AccountTypeSection';
import BankSection from './BankSection';
import CreditCardSection from './CreditCardSection';
import { formatAccountData } from './utility';
import { queryAccountById } from 'database/querying';
import styles from './styles';

const ACCOUNT_NOT_SHOW_BANK = [ACCOUNT_TYPE_LIST[0].id, ACCOUNT_TYPE_LIST[5].id];

function AddAccount() {
  const navigation = useNavigation();
  const { params } = useRoute<AccountStackRouteProps<typeof ROUTES.ADD_ACCOUNT>>();
  const dispatch = useAppDispatch();
  const { colors } = useCustomTheme();

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

  useEffect(() => {
    if (params?.accountId) {
      queryAccountById(params.accountId).then((account) => reset(account));
    }
  }, [params?.accountId]);

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
        navigation.goBack();
      })
      .catch(({ error }) => {
        showToast({
          type: 'error',
          text2: error,
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
  }, []);

  useEffect(() => {
    setValue('creditCardLimit', 0);
    setValue('initialAmount', 0);
  }, [isCreditCard]);

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
          navigation.goBack();
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

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={[styles.form, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={60}
        >
          <InputCalculator
            text={isCreditCard ? 'Hạn mức thẻ' : 'Số dư ban đầu'}
            name={isCreditCard ? 'creditCardLimit' : 'initialAmount'}
            control={control}
            inputTextColor="#007FFF"
          />
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={styles.itemGroup}>
              <SvgIcon name="clipboard" style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="accountName"
                  control={control}
                  placeholder="Tên tài khoản"
                  style={styles.formInput}
                  rules={{ required: true }}
                  maxLength={50}
                />
              </View>
            </View>
            <View style={styles.itemGroup}>
              <SvgIcon name="textWord" style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="descriptions"
                  control={control}
                  placeholder="Ghi chú"
                  style={styles.formInput}
                  maxLength={50}
                />
              </View>
            </View>
          </View>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <AccountTypeSection
              accountTypeId={accountTypeId}
              accountNotShowBank={ACCOUNT_NOT_SHOW_BANK}
            />
            {!ACCOUNT_NOT_SHOW_BANK.includes(accountTypeId) && (
              <BankSection bankIdParam={params?.bankId} />
            )}
          </View>
          {isCreditCard && <CreditCardSection colors={colors} />}
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={[styles.itemGroup, styles.itemGroupBetween]}>
              <RNText preset="title">Không tính vào báo cáo</RNText>
              <SwitchField name="excludeReport" control={control} />
            </View>
            <RNText fontSize={12} style={styles.subText}>
              Ghi chép này sẽ không thống kê vào các báo cáo.
            </RNText>
          </View>
          <FormAction
            isShowDelete={!!params?.accountId}
            onSubmit={handleSubmit(handleFormSubmit)}
            onDelete={onConfirmDeleteAccount}
          />
          <View style={{ height: 100 }} />
        </KeyboardAwareScrollView>
      </View>
    </FormProvider>
  );
}

export default AddAccount;
