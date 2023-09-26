import { useEffect } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import {
  InputField,
  RNText,
  SvgIcon,
  SwitchField,
  InputCalculator,
  FormAction,
} from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { deleteTransactionById } from 'database/querying';
import Collapsible from 'react-native-collapsible';
import { ButtonText } from 'navigation/elements';
import { TRANSACTION_TYPE } from 'utils/constant';
import MoreDetail from '../common/MoreDetail';
import styles from '../styles.common';
import { AddTransactionType } from '../type';
import AccountSelect from '../common/AccountSelect';
import Fee from '../common/Fee';
import DateTimeSelect from '../common/DateTimeSelect';

function Transfer({
  params,
  control,
  handleSubmit,
  setValue,
  watch,
  reset,
  errors,
}: AddTransactionType) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ButtonText title="Lưu" onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  const resetAccount = () => {
    setValue('accountId', '');
  };
  /** start account function */

  const handleOnDateTimePicker = (date: Date) => {
    setValue('dateTimeAt', date);
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId).then(() => navigation.goBack());
    }
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      amount: +data.amount,
      fee: +data?.fee,
    };
    console.log(requestData);
  };

  const handleOnClearFee = () => {
    setValue('fee', 0);
  };

  return (
    <View>
      <InputCalculator name="amount" control={control} />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <AccountSelect
          value={watch('accountId')}
          control={control}
          error={errors.accountId}
          title="Từ tài khoản"
          onReset={resetAccount}
        />
        <AccountSelect
          name="toAccountId"
          value={watch('toAccountId')}
          control={control}
          error={errors.toAccountId}
          title="Tới tài khoản"
          onReset={resetAccount}
        />
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <View style={styles.itemGroup}>
          <SvgIcon name="textWord" style={styles.icon} />
          <View style={styles.groupContent}>
            <InputField
              name="descriptions"
              control={control}
              placeholder="Chi tiết"
              style={styles.formInput}
              maxLength={100}
            />
          </View>
        </View>
        <View style={styles.itemGroup}>
          <SvgIcon name="map" style={styles.icon} />
          <View style={styles.groupContent}>
            <InputField
              name="location"
              control={control}
              placeholder="Địa điểm"
              style={[styles.formInput, { width: '90%' }]}
              maxLength={50}
            />
            <SvgIcon name="location" size={18} style={styles.iconForward} />
          </View>
        </View>
        <DateTimeSelect values={watch('dateTimeAt')} onChangeDate={handleOnDateTimePicker} />
      </View>
      <MoreDetail>
        <Fee onClose={handleOnClearFee}>
          <InputCalculator name="fee" control={control} />
        </Fee>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="isNotAddReport" control={control} />
          </View>
          <RNText preset="subTitle">Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
        </View>
      </MoreDetail>
      <FormAction
        isShowDelete={Boolean(params?.transactionId)}
        onDelete={onDeleteTransaction}
        onSubmit={handleSubmit(onSubmit)}
      />
      <View style={{ height: 150 }} />
    </View>
  );
}

export default Transfer;
