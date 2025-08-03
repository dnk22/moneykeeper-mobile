import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactions, TTransactionsCategory } from 'database/types';
import { useFormContext } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderIcon from 'navigation/components/HeaderIcon';
import { deleteTransactionById, updateTransaction } from 'services/api/transactions';
import { showToast } from 'utils/system';
import { formatNumber } from 'utils/math';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { TransactionParamListProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import { queryGetCurrentBalance } from 'database/querying';
import MoreDetail from '../components/MoreDetail';
import AccountSelect from '../components/AccountSelect';
import DateTimeSelect from '../components/DateTimeSelect';
import InputCalculator from '../components/InputCalculator';
import { defaultValues } from '../constant';
import { AddTransactionType } from '../type';
import CategorySelect from '../components/CategorySelect';
import styles from '../styles';
import InputField from 'components/InputField';
import SvgIcon from 'components/SvgIcon';
import SwitchField from 'components/Switch/SwitchField';
import FormAction from 'components/common/FormAction';
import RNText from 'components/Text';

function Adjustment({ params, onSubmitSuccess }: AddTransactionType) {
  const isEditMode = !!params?.transactionId;
  const { colors } = useCustomTheme();
  const prevCategoryType = useRef<TTransactionsCategory>(null);
  const navigation =
    useNavigation<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['navigation']>();
  const { name: routerName } =
    useRoute<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['route']>();
  const { control, handleSubmit, setValue, watch, getValues, reset } = useFormContext<any>();
  const [latestCurrentBalance, setLatestCurrentBalance] = useState(0);

  const differenceValue = useMemo(() => {
    return (watch('closingAmount') || 0) - latestCurrentBalance;
  }, [watch('closingAmount'), latestCurrentBalance]);

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderIcon onPress={handleSubmit(onSubmit)} />,
    });
    return () => {
      navigation.setOptions({
        headerRight: () => undefined,
      });
    };
  }, [differenceValue]);

  useEffect(() => {
    setValue('descriptions', 'Điều chỉnh số dư');
    return () => {
      setValue('descriptions', '');
    };
  }, []);

  /** get current balance and set default value to closing amount */
  useEffect(() => {
    if (params?.transactionId) {
      setLatestCurrentBalance(getValues('closingAmount') - getValues('amount'));
      return;
    }
    queryGetCurrentBalance(getValues('accountId')).then((res) => {
      if (res) {
        setLatestCurrentBalance(res.closingAmount);
        setValue('closingAmount', res.closingAmount);
      }
    });
  }, [watch('accountId'), watch('amount')]);

  /**
   * watch @differenceValue
   * change @categoryId by @differenceValue
   */
  useEffect(() => {
    if (!prevCategoryType.current) {
      return;
    }
    if (
      differenceValue <= 0 &&
      prevCategoryType.current.categoryType === TRANSACTION_CATEGORY_TYPE.INCOME
    ) {
      setValue('categoryId', '');
    } else if (
      differenceValue > 0 &&
      prevCategoryType.current.categoryType === TRANSACTION_CATEGORY_TYPE.EXPENSE
    ) {
      setValue('categoryId', '');
    } else {
      setValue('categoryId', prevCategoryType.current.id);
    }
  }, [differenceValue]);

  const handleOnDateTimePicker = (date: Date) => {
    setValue('recordAt', date);
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId).then(() => navigation.goBack());
    }
  };

  const handleOnCategoryPress = () => {
    navigation.navigate(ROUTES.TRANSACTION_CATEGORY, {
      screen: ROUTES.TRANSACTION_CATEGORY_LIST,
      params: {
        screen: differenceValue <= 0 ? ROUTES.EXPENSE_CATEGORY : ROUTES.INCOME_CATEGORY,
        params: { idActive: getValues('categoryId'), returnScreen: routerName },
        tabHide: differenceValue <= 0 ? INCOME_CATEGORY : EXPENSE_CATEGORY,
      },
    });
  };

  const onCategoryChange = (item?: TTransactionsCategory) => {
    if (item) {
      prevCategoryType.current = item;
    }
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      amount: differenceValue,
      closingAmount: +data.closingAmount,
    };
    updateTransaction({
      id: params?.transactionId,
      data: requestData,
    })
      .then(({ success }) => {
        if (!success) {
          return;
        }
        onSubmitSuccess();
        // reset form state
        reset({
          ...defaultValues,
          accountId: data?.accountId,
          transactionType: data?.transactionType,
          categoryId: '',
        });
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
      <View style={styles.currentBalance}>
        <RNText>{isEditMode ? 'Số dư tài khoản:' : 'Số dư thực tế:'}</RNText>
        <RNText style={{ fontWeight: '500' }}>{formatNumber(latestCurrentBalance, true)}</RNText>
      </View>
      <InputCalculator text="Số dư thực tế" name="closingAmount" />
      <View style={styles.currentBalance}>
        <RNText>Số dư chênh lệch:</RNText>
        <RNText style={{ fontWeight: '500' }} color={differenceValue <= 0 ? 'red' : 'green'}>
          {formatNumber(differenceValue, true)}
        </RNText>
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <AccountSelect />
        <DateTimeSelect values={watch('recordAt')} onChangeDate={handleOnDateTimePicker} />
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
        onSubmit={handleSubmit(onSubmit)}
      />
      <View style={{ height: 150 }} />
    </>
  );
}

export default Adjustment;
