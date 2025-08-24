import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TransactionParamListProps } from 'navigation/types';
import { FormProvider, useWatch } from 'react-hook-form';
import { ROUTES } from 'navigation/constants/routes';
import { TRANSACTION_TYPE } from 'utils/constants';
import ExpenseAndIncome from './ExpenseAndIncome';
import Transfer from './Transfer';
import Adjustment from './Adjustment';
import { useAddTransactionFormLogic } from './hooks/useFormLogic';
import styles from './styles';

export const COMPONENT_MAPPING = {
  [TRANSACTION_TYPE.EXPENSE]: ExpenseAndIncome,
  [TRANSACTION_TYPE.INCOME]: ExpenseAndIncome,
  [TRANSACTION_TYPE.TRANSFER]: Transfer,
  [TRANSACTION_TYPE.ADJUSTMENT]: Adjustment,
};

function AddTransactions({
  navigation,
  route,
}: TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>) {
  const { colors } = useCustomTheme();
  const { transactionForm, onSubmitSuccess, onDeleteTransaction } = useAddTransactionFormLogic({
    navigation,
    route,
  });

  const transactionType = useWatch({
    control: transactionForm.control,
    name: 'transactionType',
  });

  // Determine which transaction component to render
  const RenderTransactionComponent = useMemo(() => {
    const Content = COMPONENT_MAPPING[transactionType] || ExpenseAndIncome;
    return <Content onSubmitSuccess={onSubmitSuccess} onDelete={onDeleteTransaction} />;
  }, [transactionType, route]);

  return (
    <View style={styles.container}>
      <FormProvider {...transactionForm}>
        <KeyboardAwareScrollView
          style={[styles.form, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={40}
        >
          {RenderTransactionComponent}
        </KeyboardAwareScrollView>
      </FormProvider>
    </View>
  );
}

export default AddTransactions;
