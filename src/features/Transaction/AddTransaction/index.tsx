import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectTransactionType } from 'navigation/elements';
import { TRANSACTION_TYPE } from 'utils/constant';
import styles from './styles';
import ExpenseAndIncome from './ExpenseAndIncome';

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const [transactionType, setTransactionType] = useState<TRANSACTION_TYPE>(
    TRANSACTION_TYPE.EXPENSE,
  );

  // Use `setOptions` to update the transaction type select in header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          isSelected={transactionType}
          onItemPress={handleOnChangeTransactionType}
        />
      ),
    });
  }, [transactionType]);

  const handleOnChangeTransactionType = (item: TRANSACTION_TYPE) => {
    setTransactionType(item);
  };

  const RenderBody = useMemo(() => {
    switch (transactionType) {
      case TRANSACTION_TYPE.EXPENSE:
      case TRANSACTION_TYPE.INCOME:
        return (
          <ExpenseAndIncome
            transactionType={transactionType}
            onChangeTransactionType={handleOnChangeTransactionType}
          />
        );

      default:
        break;
    }
  }, [transactionType]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={40}
      >
        {RenderBody}
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddTransactions;
