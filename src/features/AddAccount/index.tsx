import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  InputCalculator,
  InputField,
  RNText,
  InputSelection,
  SvgIcon,
  SwitchField,
} from 'components/index';
import { TouchableOpacity, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { TAccountType, TAccount } from 'database/types/index';
import AccountTypeModalPicker from './AccountTypeModalPicker';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectBankIdSelected, selectDefaultAccountType } from 'store/account/account.selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAccountRouteProp } from 'navigation/types';
import { addAccount, getAccountById, updateAccount } from 'database/querying/accounts.query';
import { BANK_HOME_LIST, BANK_NAVIGATION } from 'navigation/constants';
import { getBankById } from 'database/querying/banks.query';
import { setBankSelected } from 'store/account/account.slice';
import { BankModel } from 'database/models';

const DEFAULT_ACCOUNT_TYPE_ID = '0';
const BANK_ID = '1';
const WALLET_ID = '4';

const defaultValues = {
  accountName: '',
  initialAmount: 0,
  accountTypeId: DEFAULT_ACCOUNT_TYPE_ID,
  isNotAddReport: false,
  isActive: true,
  currency: 'vnd',
};

const AddAccount = () => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { params } = useRoute<AddAccountRouteProp>();

  // state from store
  const initAccountType = useAppSelector((state) =>
    selectDefaultAccountType(state, DEFAULT_ACCOUNT_TYPE_ID),
  );
  const bankIdSelected = useAppSelector((state) => selectBankIdSelected(state));

  // state local
  const inputNameRef = useRef<any>(null);
  const [isShowAccountTypeModal, setIsShowAccountTypeModal] = useState<boolean>(false);
  const [accountTypeSelected, setAccountTypeSelected] = useState<TAccountType | undefined>(
    initAccountType,
  );
  const [bankSelectedState, setBankSelectedState] = useState<BankModel | undefined>(undefined);

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
      accountLogo: accountTypeSelected?.icon,
      accountTypeName: accountTypeSelected?.name,
    },
  });
  const { accountTypeId } = getValues();

  useEffect(() => {
    if (params?.accountId) {
      fetchDataInEditMode(params?.accountId);
    }
  }, [params?.accountId, reset]);

  useEffect(() => {
    if (errors?.accountName) {
      inputNameRef.current.focus();
    }
  }, [errors?.accountName]);

  /** set bankId value and reset redux state for next call */
  useEffect(() => {
    setBankSelectedValue(bankIdSelected);
    return () => {
      dispatch(setBankSelected(''));
    };
  }, [bankIdSelected]);

  const setBankSelectedValue = async (id: string) => {
    if (id) {
      const res = await getBankById(id);
      setBankSelectedState(res);
      setValuesForm({
        bankId: id,
        accountLogo: res?.icon,
      });
    }
  };

  const fetchDataInEditMode = async (id: string) => {
    const getAccountEdit = await getAccountById(id);
    let result = {
      accountName: getAccountEdit?.accountName,
      initialAmount: getAccountEdit?.initialAmount,
      currentAmount: getAccountEdit?.currentAmount,
      accountTypeId: getAccountEdit?.accountTypeId,
      accountTypeName: getAccountEdit?.accountTypeName,
      bankId: getAccountEdit?.bankId,
      currency: getAccountEdit?.currency,
      descriptions: getAccountEdit?.descriptions,
      isActive: getAccountEdit?.isActive,
      isNotAddReport: getAccountEdit?.isNotAddReport,
      userId: getAccountEdit?.userId,
      accountLogo: getAccountEdit?.accountLogo,
      sortOrder: getAccountEdit?.sortOrder,
      termType: getAccountEdit?.termType,
      termMonth: getAccountEdit?.termMonth,
      interestRate: getAccountEdit?.interestRate,
      interestPaymentType: getAccountEdit?.interestPaymentType,
      dueType: getAccountEdit?.dueType,
      startDate: getAccountEdit?.startDate,
      endDate: getAccountEdit?.endDate,
      interestPaymentToAccount: getAccountEdit?.interestPaymentToAccount,
      savingFromAccountId: getAccountEdit?.savingFromAccountId,
      numberDayOfYear: getAccountEdit?.numberDayOfYear,
    };
    reset(result);
  };

  /** open account type modal */
  const onSelectAccountType = useCallback(() => {
    setIsShowAccountTypeModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsShowAccountTypeModal(false);
  }, []);

  const getInputBankPlaceHolder = () => {
    switch (accountTypeId) {
      case BANK_ID:
        return 'Chọn ngân hàng';
      default:
        return 'Chọn nhà cung cấp';
    }
  };

  const handleOnItemModalPress = (item: TAccountType) => {
    setValuesForm({
      accountTypeId: item.id,
      accountTypeName: item.name,
      accountLogo: item.icon,
    });
    if (item.id !== accountTypeId) {
      resetSelectedBank();
    }
    setAccountTypeSelected(item);
    setIsShowAccountTypeModal(false);
  };

  const onSelectBank = () => {
    switch (accountTypeId) {
      case BANK_ID:
        navigation.navigate(BANK_NAVIGATION, {
          screen: BANK_HOME_LIST,
          params: { isWallet: false },
        });
        break;
      default:
        navigation.navigate(BANK_NAVIGATION, {
          screen: BANK_HOME_LIST,
          params: { isWallet: true },
        });
        break;
    }
  };

  const resetSelectedBank = () => {
    setValuesForm({
      bankId: '',
      accountLogo: accountTypeSelected?.icon,
    });
    setBankSelectedState(undefined);
  };

  const setValuesForm = (values: Partial<TAccount>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof TAccount, value);
    });
  };

  const onHandleSubmit = (data: TAccount) => {
    if (params?.accountId) {
      updateAccount({ id: params.accountId, account: data });
    } else {
      addAccount(data);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AccountTypeModalPicker
        isVisible={isShowAccountTypeModal}
        isItemSelected={accountTypeId}
        onToggleModal={onCloseModal}
        onPressItem={handleOnItemModalPress}
      />
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        <InputCalculator name="initialAmount" control={control} />
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <SvgIcon name="clipboard" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="accountName"
                control={control}
                placeholder="Tên tài khoản"
                style={styles.formInput}
                clearButtonMode="always"
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
                clearButtonMode="always"
                maxLength={50}
              />
            </View>
          </View>
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <InputSelection
            required
            icon={accountTypeSelected?.icon}
            value={accountTypeSelected?.name}
            onSelect={onSelectAccountType}
          />
          {(watch('accountTypeId') === BANK_ID || watch('accountTypeId') === WALLET_ID) && (
            <InputSelection
              icon={bankSelectedState?.icon}
              value={bankSelectedState?.bankName}
              title={getInputBankPlaceHolder()}
              onSelect={onSelectBank}
              onDelete={resetSelectedBank}
            />
          )}
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="isNotAddReport" control={control} />
          </View>
          <RNText style={styles.subText}>Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.group, styles.submit, { backgroundColor: colors.primary }]}
          onPress={handleSubmit(onHandleSubmit)}
        >
          <SvgIcon name="doneCircle" color="white" />
          <RNText color="white" style={{ marginLeft: 5 }}>
            Lưu
          </RNText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddAccount;
