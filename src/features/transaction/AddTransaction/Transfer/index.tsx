import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import FormAction from 'components/common/FormAction';
import InputField from 'components/InputField';
import SvgIcon from 'components/SvgIcon';
import SwitchField from 'components/Switch/SwitchField';
import RNText from 'components/Text';
import InputCalculator from 'components/InputCalculator';
import HeaderIcon from 'navigation/components/HeaderIcon';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { updateTransactionTransfer } from 'services/api/transactions';
import { showToast } from 'utils/system';
import { TransactionParamListProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import MoreDetail from '../components/MoreDetail';
import AccountSelect from '../components/AccountSelect';
import Fee from '../components/Fee';
import DateTimeSelect from '../components/DateTimeSelect';
import { AddTransactionType } from '../type';
import styles from '../styles';

function Transfer({ onSubmitSuccess, onDelete }: AddTransactionType) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['navigation']>();
  const { handleSubmit, setValue, reset, getValues, control } = useFormContext<any>();

  const transactionId = useWatch({
    control,
    name: 'id',
  });
  const recordAt = useWatch({
    control,
    name: 'recordAt',
  });

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderIcon onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  const handleOnDateTimePicker = (date: Date) => {
    setValue('recordAt', date);
  };

  const handleOnClearFee = () => {
    setValue('fee', 0);
  };

  const exchangeAccount = () => {
    const { accountId, toAccountId } = getValues();
    setValue('accountId', toAccountId);
    setValue('toAccountId', accountId);
  };

  const onSubmit = (data: TTransactions) => {
    updateTransactionTransfer({
      data,
    })
      .then(() => {
        onSubmitSuccess();
      })
      .catch(({ error }) => {
        showToast({
          type: 'error',
          text2: error,
        });
      });
  };

  return (
    <>
      <InputCalculator name="amount" />
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
          <AccountSelect title="Từ tài khoản" swapId="toAccountId" />
          <AccountSelect name="toAccountId" title="Tới tài khoản" excludeId="accountId" />
        </View>
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <DateTimeSelect values={recordAt} onChangeDate={handleOnDateTimePicker} />
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
        <Fee onClose={handleOnClearFee}>
          <InputCalculator name="fee" />
        </Fee>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="excludeReport" />
          </View>
          <RNText preset="subTitle">Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
        </View>
      </MoreDetail>
      <FormAction
        isShowDelete={Boolean(transactionId)}
        onDelete={onDelete}
        onSubmit={handleSubmit(onSubmit)}
      />
      <View style={{ height: 150 }} />
    </>
  );
}

export default Transfer;
