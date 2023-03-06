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
import { TAccountType, TAccount, TBank } from 'database/types/index';
import ModalPicker from './ModalPicker';
import { useAppSelector } from 'store/index';
import { selectAllAccountType, selectAllBank } from 'store/account/account.selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAccountRouteProp } from 'navigation/types';
import { addAccount, getAccountById, updateAccount } from 'database/querying/accounts.query';
import { ACCOUNT_TYPE, BANK_TYPE, DEFAULT_ACCOUNT_TYPE_ID } from './constants';

type ModalConfigProps = {
  title: string;
  type: typeof ACCOUNT_TYPE | typeof BANK_TYPE;
  isShowSearch?: boolean;
  itemSelected: string;
  dataSource: any[];
};

type ItemSelectedProps = TAccountType & TBank;

const AddAccount = ({}) => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<AddAccountRouteProp>();

  // state from store
  const getAccountTypeState = useAppSelector((state) => selectAllAccountType(state));
  const defaultFormData = {
    accountName: '',
    initialAmount: 0,
    currentAmount: 0,
    accountTypeId: getAccountTypeState[DEFAULT_ACCOUNT_TYPE_ID]?.id,
    accountTypeName: getAccountTypeState[DEFAULT_ACCOUNT_TYPE_ID]?.name,
    accountLogo: getAccountTypeState[DEFAULT_ACCOUNT_TYPE_ID]?.icon,
    isNotAddReport: false,
    isActive: true,
    currency: 'vnd',
  };
  const getBankState = useAppSelector((state) => selectAllBank(state));

  const modalConfig = useRef<ModalConfigProps>(null);
  const inputNameRef = useRef<any>(null);

  const [isShowModalPicker, setIsShowModalPicker] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TAccount>({
    defaultValues: { ...defaultFormData },
  });
  const { accountTypeId, bankId } = getValues();

  const fetchDataInEditMode = async (id: string) => {
    const getAccountEdit = await getAccountById(id);
    let result = {
      accountName: getAccountEdit?.accountName,
      initialAmount: getAccountEdit?.initialAmount,
      currentAmount: getAccountEdit?.currentAmount,
      accountTypeId: getAccountEdit?.accountTypeId,
      accountTypeName: getAccountEdit?.accountTypeName,
      bankId: getAccountEdit?.bankId,
      bankName: getAccountEdit?.bankName,
      bankCode: getAccountEdit?.bankCode,
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

  const onSelectAccountType = useCallback(() => {
    modalConfig.current = {
      title: 'Chọn loại tài khoản',
      type: ACCOUNT_TYPE,
      itemSelected: accountTypeId,
      isShowSearch: false,
      dataSource: Object.values(getAccountTypeState),
    };
    setIsShowModalPicker(true);
  }, []);

  const onSelectBank = useCallback(() => {
    modalConfig.current = {
      title: 'Chọn nhà cung cấp',
      type: BANK_TYPE,
      itemSelected: bankId,
      isShowSearch: true,
      dataSource: Object.values(getBankState),
    };
    setIsShowModalPicker(true);
  }, [accountTypeId]);

  const handleItemModalPickerPress = useCallback((item: ItemSelectedProps) => {
    switch (modalConfig.current?.type) {
      case BANK_TYPE:
        setValuesForm({
          bankId: item.id,
          bankName: item.bankName,
          bankCode: item.bankCode,
        });
        break;
      default:
        setValuesForm({
          accountTypeId: item.id,
          accountTypeName: item.name,
        });
        if (item.id !== accountTypeId) {
          resetSelectedBank();
        }
        break;
    }
    setValue('accountLogo', item.icon);
    setIsShowModalPicker(false);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsShowModalPicker(false);
  }, []);

  const resetSelectedBank = () => {
    setValuesForm({
      bankId: '',
      bankName: '',
      bankCode: '',
      accountLogo: getAccountTypeState[accountTypeId]?.icon,
    });
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
      <ModalPicker
        dataSource={modalConfig.current?.dataSource}
        title={modalConfig.current?.title}
        isShowSearch={modalConfig.current?.isShowSearch}
        isItemSelected={modalConfig.current?.itemSelected}
        isVisible={isShowModalPicker}
        onToggleModal={onCloseModal}
        onPressItem={handleItemModalPickerPress}
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
            icon={getAccountTypeState[watch('accountTypeId')]?.icon}
            title="Chọn loại tài khoản"
            value={getAccountTypeState[watch('accountTypeId')]?.name}
            onSelect={onSelectAccountType}
          />
          {(watch('accountTypeId') === '2' || watch('accountTypeId') === '5') && (
            <InputSelection
              icon={getBankState[watch('bankId')]?.icon}
              value={getBankState[watch('bankId')]?.bankName}
              title="Chọn nhà cung cấp"
              onSelect={onSelectBank}
              required={false}
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
        <View style={styles.spacer} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddAccount;
