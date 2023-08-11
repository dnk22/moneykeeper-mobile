import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectTransactionType } from 'navigation/elements';
import { TRANSACTION_TYPE } from 'utils/constant';
import ExpenseAndIncome from './ExpenseAndIncome';
import { AddTransactionRouteProp } from 'navigation/types';
import { isEqual } from 'lodash';
import styles from './styles';

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const { params } = useRoute<AddTransactionRouteProp>();
  const currentTransactionType = useRef<any>(params?.transactionType);

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

  useEffect(() => {
    currentTransactionType.current = params?.transactionType;
  }, [params?.transactionType]);

  const handleOnChangeTransactionType = (item: TRANSACTION_TYPE) => {
    if (!isEqual(item, currentTransactionType.current)) {
      navigation.setParams({ transactionType: item, categoryId: undefined });
      currentTransactionType.current = item;
    }
  };

  const renderForm = () => {
    switch (params?.transactionType) {
      case TRANSACTION_TYPE.EXPENSE:
      case TRANSACTION_TYPE.INCOME:
      case TRANSACTION_TYPE.LEND:
      case TRANSACTION_TYPE.BORROW:
        return <ExpenseAndIncome params={params} />;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={40}
      >
        {renderForm()}
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddTransactions;
