import { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { getTransactionByIdObserve, getTransactionCategoryById } from 'database/querying';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import { ACCOUNT_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import withObservables from '@nozbe/with-observables';
import styles from './styles';
import { TTransactions } from 'database/types';

type RecordProps = {
  id: string;
  transaction?: TTransactions;
};

function Record({ transaction }: RecordProps) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_DETAIL>['navigation']>();
  const [transactionCategory, setTransactionCategory] = useState<TransactionCategoryModel>();

  useEffect(() => {
    if (transaction?.transactionsCategoryId) {
      getTransactionCategory(transaction?.transactionsCategoryId);
    }
  }, [transaction?.transactionsCategoryId]);

  const getTransactionCategory = async (id: string) => {
    const res = await getTransactionCategoryById(id);
    setTransactionCategory(res);
  };

  const onRecordPress = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { transactionId: transaction?.id });
  };

  return (
    <TouchableHighlightComponent onPress={onRecordPress}>
      <View style={[styles.record, { backgroundColor: colors.surface }]}>
        <View style={styles.childLine} />
        <View style={styles.transactionCategoryInfo}>
          <SvgIcon name={transactionCategory?.icon} />
          <View>
            <RNText>{transactionCategory?.categoryName}</RNText>
            {transaction?.descriptions && (
              <RNText color="gray" fontSize={11}>
                {transaction.descriptions}
              </RNText>
            )}
          </View>
        </View>
        <View style={styles.amountInfo}>
          <RNText>{transaction?.amount}</RNText>
          <RNText>{transaction?.amount}</RNText>
        </View>
      </View>
    </TouchableHighlightComponent>
  );
}

export default withObservables(['transaction'], ({ id }: RecordProps) => ({
  transaction: getTransactionByIdObserve(id),
}))<any>(memo(Record, isEqual));
