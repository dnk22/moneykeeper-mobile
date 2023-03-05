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
import {
  accountSelectors,
  selectAllAccountType,
  selectAllBank,
} from 'store/account/account.selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAccountRouteProp } from 'navigation/types';
import { addAccount, deleteAllAccount } from 'database/querying/accounts.query';
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
  const defaultAccountType = getAccountTypeState[DEFAULT_ACCOUNT_TYPE_ID];
  const getBankState = useAppSelector((state) => selectAllBank(state));

  const accountDataForEditScreen = useAppSelector((state) =>
    accountSelectors.selectById(state, params?.accountId || ''),
  );

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
    defaultValues: {
      accountName: '',
      initialAmount: 0,
      currentAmount: 0,
      accountTypeId: defaultAccountType?.id,
      accountTypeName: defaultAccountType?.name,
      accountLogo: defaultAccountType?.icon,
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
    });
    setValue('accountLogo', getAccountTypeState[accountTypeId]?.icon);
  };

  const setValuesForm = (values: Partial<TAccount>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof TAccount, value);
    });
  };

  const onHandleSubmit = (data: TAccount) => {
    addAccount(data);
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
