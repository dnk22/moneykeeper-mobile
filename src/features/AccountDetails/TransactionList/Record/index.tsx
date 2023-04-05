import { memo, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import styles from './styles';
import { RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { TransactionModel } from 'database/models';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { getTransactionCategoryById } from 'database/querying';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import {
  ACCOUNT_DETAIL,
  ADD_TRANSACTION,
  CREATE_TRANSACTION_FROM_ACCOUNT,
} from 'navigation/constants';

type RecordProps = {
  item: TransactionModel;
  colors: any;
};
function Record({ item, colors }: RecordProps) {
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_DETAIL>['navigation']>();
  const [transactionCategory, setTransactionCategory] = useState<TransactionCategoryModel>();

  useEffect(() => {
    getTransactionCategory();
  }, []);

  const getTransactionCategory = async () => {
    const res = await getTransactionCategoryById(item.transactionsCategoryId);
    setTransactionCategory(res);
  };

  const onRecordPress = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, {
      screen: ADD_TRANSACTION,
      params: { transactionId: item.id },
    });
  };

  return (
    <TouchableHighlightComponent onPress={onRecordPress}>
      <View style={[styles.record, { backgroundColor: colors.surface }]}>
        <View style={styles.childLine} />
        <View style={styles.transactionCategoryInfo}>
          <SvgIcon name={transactionCategory?.icon} />
          <RNText>{transactionCategory?.categoryName}</RNText>
        </View>
        <View>
          <RNText>{item.amount}</RNText>
          <RNText>{item.amount}</RNText>
        </View>
      </View>
    </TouchableHighlightComponent>
  );
}
export default memo(Record, isEqual);
