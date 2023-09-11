import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import {
  InputField,
  RNText,
  SvgIcon,
  Switch,
  SwitchField,
  InputCalculator,
  FormAction,
} from 'components/index';
import Animated, { StretchInY } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AddTransactionRouteProp } from 'navigation/types';
import { deleteTransactionById } from 'database/querying';
import Collapsible from 'react-native-collapsible';
import { ButtonText } from 'navigation/elements';
import { isEqual } from 'lodash';
import { TRANSACTION_TYPE } from 'utils/constant';
import DateTimeSelect from '../common/DateTimeSelect';
import MoreDetail from '../common/MoreDetail';
import styles from '../styles.common';
import { updateTransaction } from 'services/api/transactions';
import { AddTransactionType } from '../type';
import CategorySelect from '../common/CategorySelect';
import AccountSelect from '../common/AccountSelect';
import Fee from '../common/Fee';
import RelatedPersonSelect from '../common/RelatedPersonSelect';

function ExpenseAndIncome({
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
  const { name } = useRoute<AddTransactionRouteProp>();

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

  const renderIfExpenseAndIncome = () => {
    return [TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME].includes(params.transactionType);
  };

  const currentTransactionTypeIs = (types: TRANSACTION_TYPE[]) => {
    return types.includes(params.transactionType);
  };

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
    console.log(requestData, 'requestData');
    return;
    updateTransaction({
      id: params?.transactionId,
      data: requestData,
    }).then((res) => {
      if (res) {
        // reset form state
        reset({
          ...defaultValues,
          accountId: data?.accountId,
          transactionType: data?.transactionType,
        });
      }
      if (navigation.canGoBack() && isEqual(name, CREATE_TRANSACTION_FROM_ACCOUNT)) {
        // navigate to prev screen
        navigation.goBack();
      }
    });
  };

  const handleOnClearFee = () => {
    setValue('fee', 0);
  };

  return (
    <View>
      <InputCalculator name="amount" control={control} />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <CategorySelect
          value={watch('categoryId')}
          control={control}
          error={errors.categoryId}
          currentScreen={name}
        />
        {!renderIfExpenseAndIncome() && (
          <RelatedPersonSelect
            control={control}
            title={
              watch('transactionType') === TRANSACTION_TYPE.BORROW ? 'Người cho vay' : 'Người vay'
            }
          />
        )}
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
        <DateTimeSelect values={watch('dateTimeAt')} onChangeDate={handleOnDateTimePicker} />
        <AccountSelect
          value={watch('accountId')}
          control={control}
          error={errors.accountId}
          onReset={resetAccount}
        />
      </View>
      <MoreDetail>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {currentTransactionTypeIs([TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME]) && (
            <>
              <View style={styles.itemGroup}>
                <SvgIcon name="people" style={styles.icon} />
                <View style={styles.groupContent}>
                  <InputField
                    name={watch('transactionType') === TRANSACTION_TYPE.EXPENSE ? 'giver' : 'payee'}
                    control={control}
                    placeholder={
                      watch('transactionType') === TRANSACTION_TYPE.EXPENSE
                        ? 'Chi cho ai'
                        : 'Nhận từ ai'
                    }
                    style={styles.formInput}
                    maxLength={50}
                  />
                </View>
              </View>
              <View style={styles.itemGroup}>
                <SvgIcon name="camp" style={styles.icon} />
                <View style={styles.groupContent}>
                  <InputField
                    name="eventName"
                    control={control}
                    placeholder="Sự kiện"
                    style={styles.formInput}
                    maxLength={50}
                  />
                </View>
              </View>
            </>
          )}
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
        </View>
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

export default ExpenseAndIncome;
