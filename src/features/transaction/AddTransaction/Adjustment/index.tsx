import React from 'react';
import { View } from 'react-native';
import InputField from 'components/InputField';
import SvgIcon from 'components/SvgIcon';
import SwitchField from 'components/Switch/SwitchField';
import FormAction from 'components/common/FormAction';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import InputCalculator from 'components/InputCalculator';
import MoreDetail from '../components/MoreDetail';
import AccountSelect from '../components/AccountSelect';
import DateTimeSelect from '../components/DateTimeSelect';
import CategorySelect from '../components/CategorySelect';
import useTransferLogic from '../hooks/useTransferLogic';
import { AddTransactionType } from '../type';
import styles from '../styles';

function Adjustment({ params, onSubmitSuccess }: AddTransactionType) {
  const { colors } = useCustomTheme();
  const {
    isEditMode,
    latestCurrentBalance,
    differenceBalance,
    formValues,
    handleOnDateTimePicker,
    handleOnCategoryPress,
    onCategoryChange,
    onDeleteTransaction,
    onSubmit,
  } = useTransferLogic({
    params,
    onSubmitSuccess,
  });

  return (
    <>
      <View style={styles.currentBalance}>
        <RNText>{isEditMode ? 'Số dư tài khoản:' : 'Số dư thực tế:'}</RNText>
        <RNText style={{ fontWeight: '500' }}>{formatNumber(latestCurrentBalance, true)}</RNText>
      </View>
      <InputCalculator text="Số dư thực tế" name="closingAmount" />
      <View style={styles.currentBalance}>
        <RNText>Số dư chênh lệch:</RNText>
        <RNText style={{ fontWeight: '500' }} color={differenceBalance <= 0 ? 'red' : 'green'}>
          {formatNumber(differenceBalance, true)}
        </RNText>
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <AccountSelect />
        <DateTimeSelect values={formValues.recordAt} onChangeDate={handleOnDateTimePicker} />
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <CategorySelect onPress={handleOnCategoryPress} onChange={onCategoryChange} />
        <View style={styles.itemGroup}>
          <SvgIcon name="textWord" style={styles.iconShadow} />
          <View style={styles.groupContent}>
            <InputField
              name="descriptions"
              placeholder="Chi tiết"
              style={styles.formInput}
              maxLength={100}
            />
          </View>
        </View>
        <View style={styles.itemGroup}>
          <SvgIcon name="map" style={styles.iconShadow} />
          <View style={styles.groupContent}>
            <InputField
              name="location"
              placeholder="Địa điểm"
              style={[styles.formInput, { width: '90%' }]}
              maxLength={50}
            />
            <SvgIcon name="location" size={18} style={styles.iconForward} />
          </View>
        </View>
      </View>
      <MoreDetail>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="excludeReport" />
          </View>
          <RNText preset="subTitle">Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
        </View>
      </MoreDetail>
      <FormAction
        isShowDelete={Boolean(params?.transactionId)}
        onDelete={onDeleteTransaction}
        onSubmit={onSubmit}
      />
      <View style={{ height: 150 }} />
    </>
  );
}

export default Adjustment;
