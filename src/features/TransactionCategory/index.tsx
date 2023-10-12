import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { InputSearch, VirtualizedListComponent } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { getTransactionCategoryParentObserve } from 'database/querying';
import { withObservables } from '@nozbe/watermelondb/react';
import CategoryGroupItem from './CategoryGroupItem';
import MostAndRecent from './MostAndRecent';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';

type TransactionCategoryProps = {
  dataObserve?: Observable<TransactionCategoryModel[]>;
  type: TRANSACTION_CATEGORY_TYPE;
};

function TransactionCategory({ dataObserve, type }: TransactionCategoryProps) {
  const { colors } = useCustomTheme();

  const renderItem = ({ item }: { item: TransactionCategoryModel }) => {
    return <CategoryGroupItem item={item} id={item?.id} type={type} />;
  };

  const handleOnSearch = () => {};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ padding: 6 }}>
        {type !== TRANSACTION_CATEGORY_TYPE.LEND_BORROW && (
          <>
            <InputSearch
              placeholder="Nhập tên"
              onChangeText={handleOnSearch}
              backgroundColor={colors.surface}
              style={{ marginBottom: 10 }}
            />
            <MostAndRecent type={type} />
          </>
        )}
        <VirtualizedListComponent data={dataObserve} renderItem={renderItem} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default withObservables(['dataObserve'], ({ type }: TransactionCategoryProps) => ({
  dataObserve: getTransactionCategoryParentObserve(type),
}))<any>(TransactionCategory);
