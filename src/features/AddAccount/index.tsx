import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { InputField, RNText, SvgIcon, SwitchField, FormAction } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { TAccountType, TAccount } from 'database/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import Submit from 'navigation/elements/Submit';
import Collapsible from 'react-native-collapsible';
import { BankModel } from 'database/models';
import InputCalculator from 'features/Transaction/AddTransaction/common/InputCalculator';
import { ADD_ACCOUNT } from 'navigation/constants';
import { AccountType } from 'utils/data';
import { deleteAccountById, getAccountById, updateAccountDB } from 'services/api/accounts';
import { showToast } from 'utils/system';
import Notifications from './Notifications';
import StatementModalPicker from './StatementModalPicker';
import AccountTypeSelect from './AccountTypeSelect';
import AccountBankSelect from './AccountBankSelect';
import { get } from 'lodash';
import { ACCOUNT_CATEGORY_ID } from 'utils/constant';
import { useAppDispatch } from 'store/index';
import {
  removeAccountStatement,
  updateAccountNotification,
  updateAccountStatement,
} from 'store/account/account.slice';
import styles from './styles';

const defaultValues = {
  accountName: '',
  initialAmount: 0,
  creditCardLimit: 0,
  creditCardIsReminder: false,
  creditCardStatementDay: 5,
  creditCardDayAfterStatement: 15,
  creditCardReminderList: '',
  excludeReport: false,
  isActive: true,
  currency: 'vnd',
  descriptions: '',
};

type ModalType = 'paymentDate' | 'statementDay';

function AddAccount() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<AccountStackParamListProps<typeof ADD_ACCOUNT>['route']>();
  const [isShowModalStatement, setIsShowModalStatement] = useState(false);
  const dispatch = useAppDispatch();

  // state local
  const inputNameRef = useRef<any>(null);
  const bankLogo = useRef<any>(null);
  const isModalType = useRef<ModalType>('statementDay');

  // state from store
  const ACCOUNT_NOT_SHOW_BANK = [AccountType[0].id, AccountType[5].id];

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TAccount>({
    defaultValues: {
      ...defaultValues,
      accountTypeId: AccountType[0].id,
      accountTypeName: AccountType[0].name,
    },
  });

  const isCreditCard = useMemo(
    () => watch('accountTypeId') === AccountType[2].id,
    [watch('accountTypeId')],
  );
  const currentAccountType = useMemo(() => watch('accountTypeId'), [watch('accountTypeId')]);

  // // Use `setOptions` to update account
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Submit onPress={handleSubmit(onHandleSubmit)} />,
    });
  }, []);

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
    reset(editAccountData);
  };

  const onAccountTypeChange = (item: TAccountType) => {
    resetSelectedBank();
    setValuesForm({
      accountTypeId: item.id,
      accountTypeName: item.name,
    });
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

  const handleOnOpenModalSelectPaymentDay = (type: ModalType) => {
    isModalType.current = type;
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
      initialAmount:
        data.accountTypeId !== ACCOUNT_CATEGORY_ID.CREDITCARD ? +get(data, 'initialAmount', 0) : 0,
      creditCardLimit: +get(data, 'creditCardLimit', 0),
      accountLogo: bankLogo.current || AccountType[getValues('accountTypeId')].icon,
      creditCardReminderList: data.creditCardIsReminder ? data.creditCardReminderList : '',
    };
    updateAccountDB({ id: params?.accountId, account: requestData })
      .then((res: string) => {
        if (res) {
          if (requestData.accountTypeId === ACCOUNT_CATEGORY_ID.CREDITCARD) {
            dispatch(
              updateAccountStatement({
                [res]: {
                  statementDate: requestData.creditCardStatementDay,
                  paymentDate: requestData.creditCardDayAfterStatement,
                },
              }),
            );
            dispatch(
              updateAccountNotification({
                [res]: requestData.creditCardIsReminder ? requestData.creditCardReminderList : '',
              }),
            );
          } else {
            dispatch(removeAccountStatement(res));
            dispatch(
              updateAccountNotification({
                [res]: '',
              }),
            );
          }
          navigation.goBack();
        }
      })
      .catch(({ error }) => {
        console.log(error, 'error');
        showToast({
          type: 'error',
          text2: error,
        });
      });
  };

  const onOkDelete = () => {
    params?.accountId &&
      deleteAccountById(params.accountId)
        .then(() => {
          showToast({
            type: 'success',
            text2: 'Xóa tài khoản thành công',
          });
          dispatch(removeAccountStatement(params.accountId));
          navigation.goBack();
        })
        .catch(({ error }) => {
          showToast({
            type: 'error',
            text2: error,
          });
        });
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
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        {!isCreditCard && (
          <InputCalculator
            text="Số dư ban đầu"
            name="initialAmount"
            control={control}
            inputTextColor="#007FFF"
          />
        )}
        {isCreditCard && (
          <InputCalculator
            text="Hạn mức thẻ"
            name="creditCardLimit"
            control={control}
            inputTextColor="#007FFF"
          />
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
            value={AccountType[currentAccountType]}
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
              statementDate={watch('creditCardStatementDay')}
              paymentDate={watch('creditCardDayAfterStatement')}
              onValueChange={onStatementChange}
              onToggleModal={onToggleModalStatement}
            />
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <View style={[styles.itemGroup, { gap: 10 }]}>
                  <SvgIcon name="calendarHoliday" style={styles.icon} />
                  <RNText preset="title">Ngày sao kê</RNText>
                </View>
                <Pressable
                  style={styles.statementDay}
                  onPress={() => handleOnOpenModalSelectPaymentDay('statementDay')}
                >
                  <RNText>{watch('creditCardStatementDay')}</RNText>
                </Pressable>
              </View>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <View style={[styles.itemGroup, { gap: 10 }]}>
                  <SvgIcon name="calendarHoliday" style={styles.icon} />
                  <RNText preset="title">Hạn thanh toán sau sao kê</RNText>
                </View>
                <Pressable
                  style={styles.statementDay}
                  onPress={() => handleOnOpenModalSelectPaymentDay('paymentDate')}
                >
                  <RNText>{watch('creditCardDayAfterStatement')}</RNText>
                </Pressable>
              </View>
            </View>

            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <RNText preset="title">Thông báo thanh toán ?</RNText>
                <SwitchField name="creditCardIsReminder" control={control} />
              </View>
              <Collapsible collapsed={!watch('creditCardIsReminder')}>
                <Notifications
                  value={watch('creditCardReminderList')}
                  onValueChange={onNotificationListChange}
                />
              </Collapsible>
            </View>
          </>
        )}

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
