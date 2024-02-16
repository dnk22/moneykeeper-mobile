import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import { InputField, RNText, SvgIcon, SwitchField, FormAction } from 'components/index';
import { useFormContext } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import Submit from 'navigation/elements/Submit';
import { deleteTransactionById, updateTransactionTransfer } from 'services/api/transactions';
import { showToast } from 'utils/system';
import { TransactionParamListProps } from 'navigation/types';
import { ADD_TRANSACTION } from 'navigation/constants';
import MoreDetail from '../common/MoreDetail';
import AccountSelect from '../common/AccountSelect';
import Fee from '../common/Fee';
import DateTimeSelect from '../common/DateTimeSelect';
import InputCalculator from '../common/InputCalculator';
import { defaultValues } from '../constant';
import { AddTransactionType } from '../type';
import styles from '../styles.common';

function Transfer({ params, onSubmitSuccess }: AddTransactionType) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionParamListProps<typeof ADD_TRANSACTION>['navigation']>();
  const { control, handleSubmit, setValue, watch, reset, getValues } = useFormContext<any>();

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Submit onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  const handleOnDateTimePicker = (date: Date) => {
    setValue('dateTimeAt', date);
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId).then(() => navigation.goBack());
    }
  };

  const onSubmit = (data: TTransactions) => {
    updateTransactionTransfer({
      id: params?.transactionId,
      data,
    })
      .then(({ success }) => {
        if (!success) {
          return;
        }
        onSubmitSuccess();
        // reset form state
        reset({
          ...defaultValues,
          toAccountId: '',
          accountId: data?.accountId,
          transactionType: data?.transactionType,
        });
      })
      .catch(({ error }) => {
        showToast({
          type: 'error',
          text2: error,
        });
      });
  };

  const handleOnClearFee = () => {
    setValue('fee', 0);
  };

  const exchangeAccount = () => {
    const { accountId, toAccountId } = getValues();
    setValue('accountId', toAccountId);
    setValue('toAccountId', accountId);
  };

  return (
    <>
      <InputCalculator name="amount" control={control} />
      <View
        style={[
          styles.group,
          { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
        ]}
      >
        <Pressable onPress={exchangeAccount}>
          <SvgIcon name="exchange" style={styles.iconExchange} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <AccountSelect title="Từ tài khoản" swapId="toAccountId" isShowSubTitle />
          <AccountSelect
            name="toAccountId"
            title="Tới tài khoản"
            excludeId="accountId"
            isShowSubTitle
          />
        </View>
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <DateTimeSelect values={watch('dateTimeAt')} onChangeDate={handleOnDateTimePicker} />
        <View style={styles.itemGroup}>
          <SvgIcon name="textWord" style={styles.iconShadow} />
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
          <SvgIcon name="map" style={styles.iconShadow} />
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
      <MoreDetail>
        <Fee onClose={handleOnClearFee}>
          <InputCalculator name="fee" control={control} />
        </Fee>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="excludeReport" control={control} />
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
    </>
  );
}

export default Transfer;
