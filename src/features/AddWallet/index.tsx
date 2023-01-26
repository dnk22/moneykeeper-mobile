import React from 'react';
import {
  InputCalculator,
  InputField,
  PressableHaptic,
  RNText,
  SvgIcon,
  SwitchField,
} from 'components/index';
import { TouchableOpacity, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatDateLocal } from 'utils/date';
import { useForm } from 'react-hook-form';
import { TTransactions } from 'src/types/models';

const AddWallet = ({}) => {
  const { colors } = useCustomTheme();

  const { control, handleSubmit, getValues, setValue, watch } = useForm<TTransactions>({
    defaultValues: {},
  });
  const { transactions_type_details, date_time } = getValues();

  const onHandleSubmit = (data: TTransactions) => {
    console.log(data);
  };
  return (
    <View style={styles.container}>
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
          <View style={styles.itemGroup}>
            <SvgIcon name="add" style={styles.icon} />
            <View style={styles.groupContent}>
              <RNText>{watch('transactions_category') || 'Chọn danh mục'}</RNText>
              <SvgIcon name="forward" size={18} style={styles.iconForward} />
            </View>
          </View>
          <View style={styles.itemGroup}>
            <SvgIcon name="add" style={styles.icon} />
            <View style={styles.groupContent}>
              <RNText>{watch('transactions_category') || 'Chọn tài khoản'}</RNText>
              <SvgIcon name="forward" size={18} style={styles.iconForward} />
            </View>
          </View>
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
