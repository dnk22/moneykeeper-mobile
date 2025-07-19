import React from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TransactionParamListProps } from 'navigation/types';
import { FormProvider } from 'react-hook-form';
import { TRANSACTION_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';
import ExpenseAndIncome from './ExpenseAndIncome';
import Transfer from './Transfer';
import Adjustment from './Adjustment';
import { useAddTransactionFormLogic } from './hooks/useFormLogic';
import styles from './styles';

const componentMap = {
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
  const { transactionForm, getValues, onSubmitSuccess } = useAddTransactionFormLogic({
    navigation,
    route,
  });

  // Determine which transaction component to render
  const RenderTransactionComponent = () => {
    const type = getValues('transactionType');

    const Component = componentMap[type];
    return <Component params={route.params} onSubmitSuccess={onSubmitSuccess} />;
  };

  return (
    <View style={styles.container}>
      <FormProvider {...transactionForm}>
        <KeyboardAwareScrollView
          style={[styles.form, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={40}
        >
          <RenderTransactionComponent />
        </KeyboardAwareScrollView>
      </FormProvider>
    </View>
  );
}

export default AddTransactions;
