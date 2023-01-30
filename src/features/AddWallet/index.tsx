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
import { TAccountType, TAccount } from 'types/models';
import ModalPicker from './ModalPicker';
import { useAppSelector } from 'store/index';
import {
  accountTypeSelectors,
  bankSelectors,
  providerSelectors,
} from 'store/account/account.selector';

const AddWallet = ({}) => {
  const { colors } = useCustomTheme();
  const isModalType = useRef('');
  const [isShowModalPicker, setIsShowModalPicker] = useState<boolean>(false);

  const { control, handleSubmit, getValues, setValue, watch } = useForm<TAccount>({
    defaultValues: {
      initial_amount: 0,
      account_type: '1',
      created_date: new Date(),
      is_active: true,
      currency: 'vnd',
    },
  });
  const { account_type, provider, bank } = getValues();

  const getAllAccountType = useAppSelector((state) => accountTypeSelectors.selectEntities(state));
  const getAllProvider = useAppSelector((state) => providerSelectors.selectEntities(state));
  const getAllBankList = useAppSelector((state) => bankSelectors.selectEntities(state));

  // get current account type selected
  const currentAccountType = getAllAccountType[account_type];
  const currentProvider = (type: string) => {
    if (provider) {
      if (type === 'eWallet') {
        return getAllProvider[provider];
      }
    }
    if (bank) {
      if (type === 'bank') {
        return getAllBankList[bank];
      }
    }
  };

  const onSelectWalletType = useCallback(() => {
    isModalType.current = '';
    setIsShowModalPicker(true);
  }, []);

  const onSelectProvider = useCallback(() => {
    currentAccountType?.value === 'bank'
      ? (isModalType.current = 'bank')
      : (isModalType.current = 'eWallet');
    setIsShowModalPicker(true);
  }, [currentAccountType]);

  const onCloseModal = useCallback(() => {
    setIsShowModalPicker(false);
  }, []);

  const onItemModalPickerPress = useCallback((item: TAccountType) => {
    switch (isModalType.current) {
      case 'bank':
        setValue('bank', item._id);
        break;
      case 'eWallet':
        setValue('provider', item._id);
        break;
      default:
        setValue('account_type', item._id);
        break;
    }
    onCloseModal();
  }, []);

  useEffect(() => {
    // reset provider and bank value
    switch (account_type) {
      case 'bank':
        setValue('provider', '');
        break;
      case 'eWallet':
        setValue('bank', '');
        break;
      default:
        setValue('provider', '');
        setValue('bank', '');
        break;
    }
  }, [account_type]);

  const onHandleSubmit = (data: TAccount) => {
    console.log(data);
  };

  const isItemSelected = isModalType.current === '' ? account_type : provider;

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
        <InputCalculator />
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
