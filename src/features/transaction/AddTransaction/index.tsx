import React from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TransactionParamListProps } from 'navigation/types';
import { FormProvider } from 'react-hook-form';
import { ROUTES } from 'navigation/constants/routes';
import { useAddTransactionFormLogic } from './hooks/useFormLogic';
import { COMPONENT_MAPPING } from './constant';
import styles from './styles';

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

    const Content = COMPONENT_MAPPING[type];
    return <Content params={route.params} onSubmitSuccess={onSubmitSuccess} />;
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
