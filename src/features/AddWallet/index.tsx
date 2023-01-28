import React, { useCallback, useMemo, useState } from 'react';
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
import SelectWalletType from './SelectWalletType';
import { useAppSelector } from 'store/index';
import { accountTypeSelectors } from 'store/account/account.selector';
import { useEffect } from 'react';

const AddWallet = ({}) => {
  const { colors } = useCustomTheme();
  const [isShowModalWalletType, setIsShowModalWalletType] = useState<boolean>(false);

  const { control, handleSubmit, getValues, setValue, watch } = useForm<TAccount>({
    defaultValues: {
      account_type: '1',
    },
  });

  const { account_type } = getValues();

  const getAllAccountType = useAppSelector((state) => accountTypeSelectors.selectEntities(state));

  useEffect(() => {
    if (account_type) {
      setValue('account_type_details', getAllAccountType[account_type]);
    }
  }, [account_type]);

  const onSelectWalletType = useCallback(() => {
    setIsShowModalWalletType(!isShowModalWalletType);
  }, [isShowModalWalletType]);

  const onItemWalletTypePress = useCallback((item: TAccountType) => {
    setValue('account_type', item._id);
    setIsShowModalWalletType(false);
  }, []);

  const onHandleSubmit = (data: TAccount) => {
    console.log(data);
  };

  const currentAccountType = getAllAccountType[account_type];

  return (
    <View style={styles.container}>
      <SelectWalletType
        isVisible={isShowModalWalletType}
        onToggleModal={onSelectWalletType}
        onPressItem={onItemWalletTypePress}
        isTypeSelected={account_type}
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
                name="descriptions"
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
              title={currentAccountType?.value === 'bank' ? 'Chọn ngân hàng' : 'Chọn nhà cung cấp'}
              onSelect={onSelectWalletType}
            />
          )}
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="is_add_report" control={control} />
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
