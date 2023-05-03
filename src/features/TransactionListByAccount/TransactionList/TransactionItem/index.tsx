import { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { getTransactionCategoryById } from 'database/querying';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import { ACCOUNT_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { TransactionModel } from 'database/models';
import styles from './styles';
import isEqual from 'react-fast-compare';

type TransactionItemProps = {
  data: TransactionModel;
};

function TransactionItem({ data }: TransactionItemProps) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_DETAIL>['navigation']>();
  const [transactionCategory, setTransactionCategory] = useState<TransactionCategoryModel>();

  useEffect(() => {
    if (data?.transactionsCategoryId) {
      getTransactionCategory(data?.transactionsCategoryId);
    }
  }, [data?.transactionsCategoryId]);

  const getTransactionCategory = async (id: string) => {
    const res = await getTransactionCategoryById(id);
    setTransactionCategory(res);
  };

  const onTransactionItemPress = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { transactionId: data?.id });
  };

  return (
    <TouchableHighlightComponent onPress={onTransactionItemPress}>
      <View style={[styles.record, { backgroundColor: colors.surface }]}>
        <View style={styles.childLine} />
        <View style={styles.transactionCategoryInfo}>
          <SvgIcon name={transactionCategory?.icon} />
          <View>
            <RNText>{transactionCategory?.categoryName}</RNText>
            {data?.descriptions && (
              <RNText color="gray" fontSize={11}>
                {data.descriptions}
              </RNText>
            )}
          </View>
        </View>
        <View style={styles.amountInfo}>
          <RNText>{data?.amount}</RNText>
          <RNText>{data?.amount}</RNText>
        </View>
      </View>
    </TouchableHighlightComponent>
  );
}

export default memo(TransactionItem, isEqual);
