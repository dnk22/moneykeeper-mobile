import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import ModalPicker from './ModalPicker';
import { useAppDispatch, useAppSelector } from 'store/index';
import {
  accountSelectors,
  accountTypeSelectors,
  selectAllAccountType,
  selectAllBank,
} from 'store/account/account.selector';
import { addOrUpdateAccount } from 'store/account/account.slice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAccountRouteProp } from 'navigation/types';
import { addAccount } from 'database/querying/accounts.query';
import { ACCOUNT_TYPE, BANK_TYPE, DEFAULT_ACCOUNT_TYPE_ID } from './constants';

const AddAccount = ({}) => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const useDispatch = useAppDispatch();
  const { params } = useRoute<AddAccountRouteProp>();

  // state from store
  const getAccountTypeState = useAppSelector((state) => selectAllAccountType(state));
  const defaultAccountType = getAccountTypeState[DEFAULT_ACCOUNT_TYPE_ID];
  const getBankState = useAppSelector((state) => selectAllBank(state));

  const accountDataForEditScreen = useAppSelector((state) =>
    accountSelectors.selectById(state, params?.accountId || ''),
  );

  const isModalTitle = useRef<string>('');
  const isModalType = useRef<string>(ACCOUNT_TYPE);
  const isItemSelected = useRef<any>(defaultAccountType?.id);
  const inputNameRef = useRef<any>(null);

  const [isShowModalPicker, setIsShowModalPicker] = useState<boolean>(false);
  const [dataModal, setDataModal] = useState<any>(Object.values(getAccountTypeState));

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
      id: '',
      accountName: '',
      initialAmount: 0,
      currentAmount: 0,
      accountTypeId: defaultAccountType?.id,
      isNotAddReport: false,
      isActive: true,
      currency: 'vnd',
    },
  });
  const { accountTypeId, bankId } = getValues();

  useEffect(() => {
    if (params?.accountId) {
      reset(accountDataForEditScreen);
    }
  }, [params?.accountId, reset]);

  useEffect(() => {
    if (errors?.accountName) {
      inputNameRef.current.focus();
    }
  }, [errors?.accountName]);

  const isShowSearch = useMemo(() => isModalType.current === BANK_TYPE, [isModalType]);

  const onSelectAccountType = useCallback(() => {
    isModalType.current = ACCOUNT_TYPE;
    isModalTitle.current = 'Chọn loại tài khoản';
    isItemSelected.current = accountTypeId;
    setDataModal(Object.values(getAccountTypeState));
    setIsShowModalPicker(true);
  }, []);

  const onSelectBank = useCallback(() => {
    isModalType.current = BANK_TYPE;
    isModalTitle.current = 'Chọn nhà cung cấp';
    isItemSelected.current = bankId;
    setDataModal(Object.values(getBankState));
    setIsShowModalPicker(true);
  }, [accountTypeId]);

  const handleItemModalPickerPress = useCallback((item: TAccountType) => {
    switch (isModalType.current) {
      case BANK_TYPE:
        setSelectedBank(item.id, item);
        break;
      default:
        setSelectedAccountType(item.id, item);
        if (item.id !== accountTypeId) {
          resetSelectedBank();
        }
        break;
    }
    setIsShowModalPicker(false);
  }, []);

  const setSelectedBank = (bankId: string, bankDetails: TAccountType) => {
    setSelectedValues({
      bankId,
    });
  };

  const setSelectedAccountType = (accountTypeId: string, accountTypeDetails: TAccountType) => {
    setSelectedValues({
      accountTypeId,
    });
  };

  const resetSelectedBank = () => {
    setSelectedValues({
      bankId: '',
    });
  };

  const setSelectedValues = (values: Partial<TAccount>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof TAccount, value);
    });
  };

  const onCloseModal = useCallback(() => {
    setIsShowModalPicker(false);
  }, []);

  const onHandleSubmit = (data: TAccount) => {
    console.log(data, 'data');
    // addAccount(data);
    // useDispatch(addOrUpdateAccount(data));
    // navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ModalPicker
        dataSource={dataModal}
        isVisible={isShowModalPicker}
        title={isModalTitle.current}
        isShowSearch={isShowSearch}
        onToggleModal={onCloseModal}
        onPressItem={handleItemModalPickerPress}
        isItemSelected={isItemSelected.current}
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
          {watch('accountTypeId') === '1' ||
            (watch('accountTypeId') === '3' && (
              <InputSelection
                icon={watch('bankIcon')}
                value={watch('bankName')}
                title={watch('accountTypeId') === '1' ? 'Chọn ngân hàng' : 'Chọn nhà cung cấp'}
                onSelect={onSelectBank}
                required={false}
                onDelete={resetSelectedBank}
              />
            ))}
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
