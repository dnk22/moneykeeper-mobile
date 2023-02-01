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
import {
  accountTypeSelectors,
  bankSelectors,
  providerSelectors,
} from 'store/account/account.selector';
import { addOrUpdateAccount } from 'store/account/account.slice';
import { useNavigation } from '@react-navigation/native';

const AddWallet = ({}) => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const isModalType = useRef('');
  const inputNameRef = useRef<any>(null);
  const [isShowModalPicker, setIsShowModalPicker] = useState<boolean>(false);

  const useDispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<TAccount>({
    defaultValues: {
      initial_amount: 0,
      current_amount: 0,
      account_type: '1',
      account_type_name: 'Tiền mặt',
      created_date: new Date(),
      is_active: true,
      currency: 'vnd',
      icon: {
        accountType: 'cash',
      },
    },
  });
  const { account_type, provider, bank } = getValues();

  const getAllAccountType = useAppSelector((state) => accountTypeSelectors.selectEntities(state));
  const getAllProvider = useAppSelector((state) => providerSelectors.selectEntities(state));
  const getAllBankList = useAppSelector((state) => bankSelectors.selectEntities(state));

  // get current account type selected
  const currentAccountType = getAllAccountType[account_type];
  const currentProvider = useCallback(
    (type: string) => {
      if (provider) {
        if (type === 'eWallet') {
          return getAllProvider[provider];
        }
      } else if (bank) {
        if (type === 'bank') {
          return getAllBankList[bank];
        }
      } else return undefined;
    },
    [watch('provider'), watch('bank')],
  );

  const onSelectWalletType = useCallback(() => {
    isModalType.current = '';
    setIsShowModalPicker(true);
  }, []);

  const onSelectProvider = useCallback(() => {
    currentAccountType?.value === 'bank'
      ? (isModalType.current = 'bank')
      : (isModalType.current = 'eWallet');
    setIsShowModalPicker(true);
  }, [currentAccountType?.value]);

  const onCloseModal = useCallback(() => {
    setIsShowModalPicker(false);
  }, []);

  const onItemModalPickerPress = useCallback((item: TAccountType) => {
    switch (isModalType.current) {
      case 'bank':
        setValue('bank', item._id);
        setValue('icon.bank', item.icon);
        break;
      case 'eWallet':
        setValue('provider', item._id);
        setValue('icon.provider', item.icon);
        break;
      default:
        setValue('account_type', item._id);
        setValue('account_type_name', item.name);
        setValue('icon.accountType', item.icon);
        break;
    }
    onCloseModal();
  }, []);

  const onDeleteBankProvider = useCallback(() => {
    setValue('provider', '');
    setValue('bank', '');
  }, []);

  useEffect(() => {
    // reset provider and bank value
    switch (account_type) {
      case 'bank':
        setValue('provider', '');
        setValue('icon.provider', undefined);
        break;
      case 'eWallet':
        setValue('bank', '');
        setValue('icon.bank', undefined);
        break;
      default:
        setValue('provider', '');
        setValue('icon.provider', undefined);
        setValue('bank', '');
        setValue('icon.bank', undefined);
        break;
    }
  }, [account_type]);

  useEffect(() => {
    if (errors?.name) {
      inputNameRef.current.focus();
    }
  }, [errors?.name, setFocus]);

  const onHandleSubmit = (data: TAccount) => {
    useDispatch(addOrUpdateAccount(data));
    navigation.goBack();
  };

  const isItemSelected =
    isModalType.current === '' ? account_type : isModalType.current === 'eWallet' ? provider : bank;

  return (
    <View style={styles.container}>
      <ModalPicker
        isShowData={isModalType.current}
        isVisible={isShowModalPicker}
        onToggleModal={onCloseModal}
        onPressItem={onItemModalPickerPress}
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
            icon={currentAccountType?.icon}
            title="Chọn loại tài khoản"
            value={currentAccountType?.name}
            onSelect={onSelectWalletType}
          />
          {(currentAccountType?.value === 'bank' || currentAccountType?.value === 'eWallet') && (
            <InputSelection
              icon={currentProvider(currentAccountType?.value)?.icon || 'wallet'}
              value={currentProvider(currentAccountType?.value)?.name}
              title={currentAccountType?.value === 'bank' ? 'Chọn ngân hàng' : 'Chọn nhà cung cấp'}
              onSelect={onSelectProvider}
              required={false}
              onDelete={onDeleteBankProvider}
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

export default AddWallet;
