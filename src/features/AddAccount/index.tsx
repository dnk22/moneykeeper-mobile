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
import { TAccountType, TAccount } from 'types/models';
import ModalPicker from './ModalPicker';
import { useAppDispatch, useAppSelector } from 'store/index';
import { accountSelectors, accountTypeSelectors } from 'store/account/account.selector';
import { addOrUpdateAccount } from 'store/account/account.slice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAccountRouteProp } from 'navigation/types';
import { BANK, EWALLET } from './constants';

const DEFAULT_ACCOUNT_TYPE_ID = '1';

const AddAccount = ({}) => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const useDispatch = useAppDispatch();
  const { params } = useRoute<AddAccountRouteProp>();

  const isModalType = useRef<string | typeof BANK | typeof EWALLET>('');
  const inputNameRef = useRef<any>(null);
  const [isShowModalPicker, setIsShowModalPicker] = useState<boolean>(false);

  // get state from store
  const getDefaultAccountType = useAppSelector((state) =>
    accountTypeSelectors.selectById(state, DEFAULT_ACCOUNT_TYPE_ID),
  );
  const accountDataForEditScreen = useAppSelector((state) =>
    accountSelectors.selectById(state, params?.accountId || ''),
  );

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
      _id: '',
      name: '',
      user_created: '',
      initial_amount: 0,
      current_amount: 0,
      account_type: getDefaultAccountType?._id,
      account_type_details: getDefaultAccountType,
      created_date: new Date(),
      is_not_add_report: false,
      is_active: true,
      currency: 'vnd',
    },
  });
  const { account_type, account_type_details, provider, bank } = getValues();

  useEffect(() => {
    if (params?.accountId) {
      reset(accountDataForEditScreen);
    }
  }, [params?.accountId, reset]);

  useEffect(() => {
    if (errors?.name) {
      inputNameRef.current.focus();
    }
  }, [errors?.name]);

  const onSelectWalletType = useCallback(() => {
    isModalType.current = '';
    setIsShowModalPicker(true);
  }, []);

  const onSelectProvider = useCallback(() => {
    isModalType.current = account_type_details?.value;
    setIsShowModalPicker(true);
  }, [account_type_details?.value]);

  const handleItemModalPickerPress = useCallback((item: TAccountType) => {
    switch (isModalType.current) {
      case BANK:
        setSelectedBank(item._id, item);
        resetSelectedProvider();
        break;
      case EWALLET:
        setSelectedProvider(item._id, item);
        resetSelectedBank();
        break;
      default:
        setSelectedAccountType(item._id, item);
        resetSelectedBankAndProvider();
        break;
    }
    closeModal();
  }, []);

  const resetSelectedBankAndProvider = () => {
    resetSelectedBank();
    resetSelectedProvider();
  };

  const resetSelectedBank = () => {
    setSelectedValues({
      bank: '',
      bank_details: undefined,
    });
  };

  const resetSelectedProvider = () => {
    setSelectedValues({
      provider: '',
      provider_details: undefined,
    });
  };

  const setSelectedBank = (bankId: string, bankDetails: TAccountType) => {
    setSelectedValues({
      bank: bankId,
      bank_details: bankDetails,
    });
  };

  const setSelectedProvider = (providerId: string, providerDetails: TAccountType) => {
    setSelectedValues({
      provider: providerId,
      provider_details: providerDetails,
    });
  };

  const setSelectedAccountType = (accountTypeId: string, accountTypeDetails: TAccountType) => {
    setSelectedValues({
      account_type: accountTypeId,
      account_type_details: accountTypeDetails,
    });
  };

  const setSelectedValues = (values: Partial<TAccount>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof TAccount, value);
    });
  };

  const closeModal = () => {
    onCloseModal();
  };

  const onCloseModal = useCallback(() => {
    setIsShowModalPicker(false);
  }, []);

  const isItemSelected =
    isModalType.current === BANK
      ? bank
      : isModalType.current === 'eWallet'
      ? provider
      : account_type;

  const onHandleSubmit = (data: TAccount) => {
    useDispatch(addOrUpdateAccount(data));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ModalPicker
        isShowData={isModalType.current}
        isVisible={isShowModalPicker}
        onToggleModal={onCloseModal}
        onPressItem={handleItemModalPickerPress}
        isTypeSelected={isItemSelected}
      />
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        <InputCalculator name="initial_amount" control={control} />
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <SvgIcon name="clipboard" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="name"
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
            icon={watch('account_type_details.icon')}
            title="Chọn loại tài khoản"
            value={watch('account_type_details.name')}
            onSelect={onSelectWalletType}
          />
          {(watch('account_type_details.value') === BANK ||
            watch('account_type_details.value') === EWALLET) && (
            <InputSelection
              icon={watch('bank_details.icon') || watch('provider_details')?.icon}
              value={watch('bank_details.name') || watch('provider_details')?.name}
              title={
                watch('account_type_details.value') === BANK
                  ? 'Chọn ngân hàng'
                  : 'Chọn nhà cung cấp'
              }
              onSelect={onSelectProvider}
              required={false}
              onDelete={resetSelectedBankAndProvider}
            />
          )}
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="is_not_add_report" control={control} />
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
