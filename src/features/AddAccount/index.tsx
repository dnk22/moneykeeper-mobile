import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  InputCalculator,
  InputField,
  RNText,
  SvgIcon,
  SwitchField,
  FormAction,
} from 'components/index';
import { Alert, Pressable, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { TAccountType, TAccount } from 'database/types';
import { useAppSelector } from 'store/index';
import { selectAllAccountType } from 'store/account/account.selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAccountRouteProp } from 'navigation/types';
import { addAccount, getAccountById, updateAccount, deleteAccountById } from 'database/querying';
import Submit from 'navigation/elements/Submit';
import AccountTypeSelect from './AccountTypeSelect';
import AccountBankSelect from './AccountBankSelect';
import styles from './styles';
import { BankModel } from 'database/models';
import Collapsible from 'react-native-collapsible';
import StatementModalPicker from './StatementModalPicker';
import Notifications from './Notifications';

const DEFAULT_ACCOUNT_TYPE_ID = '0';

const defaultValues = {
  accountName: '',
  initialAmount: 0,
  creditCardLimit: 0,
  creditCardIsReminder: false,
  creditCardStatementDay: 5,
  creditCardDayAfterStatement: 15,
  creditCardReminderList: '',
  accountTypeId: DEFAULT_ACCOUNT_TYPE_ID,
  isNotAddReport: false,
  isActive: true,
  currency: 'vnd',
  descriptions: '',
};

function AddAccount() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<AddAccountRouteProp>();
  const [isShowModalStatement, setIsShowModalStatement] = useState(false);

  // state local
  const inputNameRef = useRef<any>(null);
  const bankLogo = useRef<any>(null);
  const accountTypeLogo = useRef<any>(null);
  const isModalType = useRef<'dayAfter' | 'statementDay'>('statementDay');

  // state from store
  const accountTypeState = useAppSelector((state) => selectAllAccountType(state));
  const ACCOUNT_NOT_SHOW_BANK = [accountTypeState[0].id, accountTypeState[5].id];

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TAccount>({
    defaultValues,
  });

  const isCreditCard = useMemo(
    () => watch('accountTypeId') === accountTypeState[2].id,
    [watch('accountTypeId')],
  );
  const currentAccountType = useMemo(
    () => watch('accountTypeId') || DEFAULT_ACCOUNT_TYPE_ID,
    [watch('accountTypeId')],
  );

  // // Use `setOptions` to update account
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Submit onPress={handleSubmit(onHandleSubmit)} />,
    });
  }, [watch('id')]);

  useEffect(() => {
    if (params?.accountId) {
      fetchDataInEditMode(params?.accountId);
    }
  }, [params?.accountId]);

  useEffect(() => {
    setValue('bankId', params?.bankId);
  }, [params?.bankId]);

  useEffect(() => {
    if (errors?.accountName) {
      inputNameRef.current.focus();
    }
  }, [errors?.accountName]);

  const fetchDataInEditMode = async (id: string) => {
    const editAccountData = await getAccountById(id);
    if (editAccountData?.id) {
      let result = {
        accountName: editAccountData.accountName,
        initialAmount: editAccountData.initialAmount,
        currentAmount: editAccountData.currentAmount,
        accountTypeId: editAccountData.accountTypeId,
        accountTypeName: editAccountData.accountTypeName,
        bankId: editAccountData.bankId,
        currency: editAccountData.currency,
        descriptions: editAccountData.descriptions,
        isActive: editAccountData.isActive,
        isNotAddReport: editAccountData.isNotAddReport,
        userId: editAccountData.userId,
        accountLogo: editAccountData.accountLogo,
        sortOrder: editAccountData.sortOrder,
        termType: editAccountData.termType,
        termMonth: editAccountData.termMonth,
        interestRate: editAccountData.interestRate,
        interestPaymentType: editAccountData.interestPaymentType,
        dueType: editAccountData.dueType,
        startDate: editAccountData.startDate,
        endDate: editAccountData.endDate,
        interestPaymentToAccount: editAccountData.interestPaymentToAccount,
        savingFromAccountId: editAccountData.savingFromAccountId,
        numberDayOfYear: editAccountData.numberDayOfYear,

        //credit card
        creditCardLimit: editAccountData.creditCardLimit,
        creditCardIsReminder: editAccountData.creditCardIsReminder,
        creditCardReminderList: editAccountData.creditCardReminderList,
        creditCardPaymentDay: editAccountData.creditCardPaymentDay,
        creditCardStatementDay: editAccountData.creditCardStatementDay,
        creditCardDayAfterStatement: editAccountData.creditCardDayAfterStatement,
      };
      reset(result);
    }
  };

  const onAccountTypeChange = (item: TAccountType) => {
    resetSelectedBank();
    setValuesForm({
      accountTypeId: item.id,
      accountTypeName: item.name,
    });
    accountTypeLogo.current = item.icon;
  };

  const onBankChange = (bank: BankModel) => {
    bankLogo.current = bank.icon;
  };

  const resetSelectedBank = () => {
    setValue('bankId', '');
    bankLogo.current = '';
  };

  const setValuesForm = (values: Partial<TAccount>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof TAccount, value);
    });
  };

  const handleOnOpenStatementDayPicker = () => {
    isModalType.current = 'statementDay';
    onToggleModalStatement();
  };
  const handleOnOpenDayAfterPicker = () => {
    isModalType.current = 'dayAfter';
    onToggleModalStatement();
  };

  const onToggleModalStatement = () => {
    setIsShowModalStatement(!isShowModalStatement);
  };

  const onStatementChange = (value: number) => {
    if (isModalType.current === 'statementDay') {
      setValue('creditCardStatementDay', value);
    } else {
      setValue('creditCardDayAfterStatement', value);
    }
    onToggleModalStatement();
  };

  const onNotificationListChange = (value: string) => {
    setValue('creditCardReminderList', value);
  };

  const onHandleSubmit = (data: TAccount) => {
    const requestData = {
      ...data,
      initialAmount: +data?.initialAmount,
      creditCardLimit: +data?.creditCardLimit,
      accountLogo: bankLogo.current || accountTypeLogo.current,
    };
    if (params?.accountId) {
      updateAccount({ id: params.accountId, account: requestData });
    } else {
      addAccount(requestData);
    }
    navigation.goBack();
  };

  const onOkDelete = () => {
    params?.accountId && deleteAccountById({ id: params.accountId });
    navigation.goBack();
  };

  const onConfirmDeleteAccount = () =>
    Alert.alert(
      `Xóa ${getValues('accountName')}`,
      'Xóa tài khoản đồng này nghĩa với việc tất cả các ghi chép của tài khoản này sẽ bị xóa theo, HÃY CẨN THẬN!',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        { text: 'Đồng ý', style: 'destructive', onPress: () => onOkDelete() },
      ],
    );

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        {!isCreditCard && (
          <InputCalculator text="Số dư ban đầu" name="initialAmount" control={control} />
        )}
        {isCreditCard && (
          <InputCalculator text="Hạn mức thẻ" name="creditCardLimit" control={control} />
        )}
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <SvgIcon name="clipboard" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="accountName"
                control={control}
                placeholder="Tên tài khoản"
                style={styles.formInput}
                maxLength={50}
                rules={{ required: true }}
                ref={inputNameRef}
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
          <AccountTypeSelect
            value={accountTypeState[currentAccountType]}
            onValueChange={onAccountTypeChange}
          />
          {!ACCOUNT_NOT_SHOW_BANK.includes(watch('accountTypeId')) && (
            <AccountBankSelect
              accountType={watch('accountTypeId')}
              value={watch('bankId')}
              onValueChange={onBankChange}
              onDelete={resetSelectedBank}
            />
          )}
        </View>
        {isCreditCard && (
          <>
            <StatementModalPicker
              type={isModalType.current}
              isVisible={isShowModalStatement}
              value={watch('creditCardStatementDay')}
              onValueChange={onStatementChange}
              onToggleModal={onToggleModalStatement}
            />
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <View style={[styles.itemGroup, { gap: 10 }]}>
                  <SvgIcon name="textWord" style={styles.icon} />
                  <RNText preset="title">Ngày sao kê</RNText>
                </View>
                <Pressable style={styles.statementDay} onPress={handleOnOpenStatementDayPicker}>
                  <RNText>{watch('creditCardStatementDay')}</RNText>
                </Pressable>
              </View>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <View style={[styles.itemGroup, { gap: 10 }]}>
                  <SvgIcon name="textWord" style={styles.icon} />
                  <RNText preset="title">Hạn thanh toán sau sao kê</RNText>
                </View>
                <Pressable style={styles.statementDay} onPress={handleOnOpenDayAfterPicker}>
                  <RNText>{watch('creditCardDayAfterStatement')}</RNText>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {isCreditCard && (
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={[styles.itemGroup, styles.itemGroupBetween]}>
              <RNText preset="title">Bật Thông báo ?</RNText>
              <SwitchField name="creditCardIsReminder" control={control} />
            </View>
            <Collapsible collapsed={!watch('creditCardIsReminder')}>
              <Notifications
                value={watch('creditCardReminderList')}
                onValueChange={onNotificationListChange}
              />
            </Collapsible>
          </View>
        )}
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText preset="title">Không tính vào báo cáo</RNText>
            <SwitchField name="isNotAddReport" control={control} />
          </View>
          <RNText fontSize={12} style={styles.subText}>
            Ghi chép này sẽ không thống kê vào các báo cáo.
          </RNText>
        </View>
        <FormAction
          isShowDelete={Boolean(params?.accountId)}
          onSubmit={handleSubmit(onHandleSubmit)}
          onDelete={onConfirmDeleteAccount}
        />
        <View style={{ height: 100 }} />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddAccount;
