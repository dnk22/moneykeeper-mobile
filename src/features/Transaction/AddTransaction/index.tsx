import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectTransactionType } from 'navigation/elements';
import { TRANSACTION_TYPE } from 'utils/constant';
import ExpenseAndIncome from './ExpenseAndIncome';
import { TransactionParamListProps } from 'navigation/types';
import { isEqual } from 'lodash';
import styles from './styles';
import Transfer from './Transfer';
import { useForm } from 'react-hook-form';
import { TTransactions } from 'database/types';
import { getFirstAccount, getTransactionById } from 'database/querying';
import { defaultValues } from './constant';
import { ADD_TRANSACTION } from 'navigation/constants';

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const { params } = useRoute<TransactionParamListProps<typeof ADD_TRANSACTION>['route']>();
  const currentTransactionType = useRef<any>(params?.transactionType);

  /** setup form */
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TTransactions>({
    defaultValues: {
      ...defaultValues,
      transactionType: params.transactionType,
    },
  });

  // Use `setOptions` to update the transaction type select in header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          isSelected={params?.transactionType}
          onItemPress={handleOnChangeTransactionType}
        />
      ),
    });
  }, [params?.transactionType]);

  // set default account when mode = add & accountId = null
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !watch('accountId')) {
        setDefaultAccountInModeAdd();
      }
    }, [!params?.transactionId, watch('accountId')]),
  );

  useEffect(() => {
    if (params?.transactionId) {
      fetchDataInEditMode(params.transactionId);
    }
  }, [params?.transactionId]);

  /** watch accountId */
  useEffect(() => {
    if (params?.accountId && params?.accountId !== getValues('accountId')) {
      setValue('accountId', params.accountId);
    }
  }, [params?.accountId]);

  /** get transaction category selected data */
  useEffect(() => {
    if (params?.categoryId && params?.categoryId !== getValues('categoryId')) {
      setValue('categoryId', params?.categoryId);
    }
  }, [params?.categoryId]);

  const fetchDataInEditMode = async (id: string) => {
    const res = await getTransactionById(id);
    if (res?.id) {
      const result: any = {};
      Object.keys(defaultValues).forEach(
        (item) => (result[item] = res[item] || defaultValues[item]),
      );
      reset(result);
    }
  };

  const setDefaultAccountInModeAdd = async () => {
    try {
      const firstAccount = await getFirstAccount();
      if (firstAccount && firstAccount.length) {
        setValue('accountId', firstAccount[0].id);
      }
    } catch (error) {
      Alert.alert('Oops, Lỗi rồi!', 'Có lỗi trong quá trình lấy thông tin tài khoản');
    }
  };

  const handleOnChangeTransactionType = (item: TRANSACTION_TYPE) => {
    if (!isEqual(item, currentTransactionType.current)) {
      navigation.setParams({ transactionType: item, categoryId: undefined });
      setValue('transactionType', item);
      setValue('categoryId', undefined);
      currentTransactionType.current = item;
    }
  };

  const RenderForm = useMemo(() => {
    switch (params?.transactionType) {
      case TRANSACTION_TYPE.EXPENSE:
      case TRANSACTION_TYPE.INCOME:
      case TRANSACTION_TYPE.LEND:
      case TRANSACTION_TYPE.BORROW:
        return (
          <ExpenseAndIncome
            params={params}
            control={control}
            handleSubmit={handleSubmit}
            watch={watch}
            reset={reset}
            errors={errors}
            setValue={setValue}
          />
        );
      case TRANSACTION_TYPE.TRANSFER:
        return (
          <Transfer
            params={params}
            control={control}
            handleSubmit={handleSubmit}
            watch={watch}
            reset={reset}
            errors={errors}
            setValue={setValue}
          />
        );
      default:
        break;
    }
  }, [params?.transactionType, watch()]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={40}
      >
        {RenderForm}
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddTransactions;
