import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { HEADER_TITLE_FONT_SIZE } from 'resources/theme/constants';
import UpdateTransactionCategory from 'features/TransactionCategory/Update';
import ParentList from 'features/TransactionCategory/ParentList';
import IconSelect from 'features/TransactionCategory/IconSelect';
import { TransactionCategoryParams } from 'navigation/types';
import TransactionCategoryHeaderRight from 'navigation/components/TransactionCategoryHeaderRight';

//set up routes
const TransactionCategoryStack = createNativeStackNavigator<TransactionCategoryParams>();

function TransactionCategoryNavigation() {
  return (
    <TransactionCategoryStack.Navigator initialRouteName={ROUTES.TRANSACTION_CATEGORY_LIST}>
      <TransactionCategoryStack.Screen
        name={ROUTES.TRANSACTION_CATEGORY_LIST}
        component={TransactionCategoryHeaderRight}
        options={{
          headerTitleStyle: {
            fontSize: HEADER_TITLE_FONT_SIZE,
          },
        }}
      />
      <TransactionCategoryStack.Screen
        name={ROUTES.UPDATE_TRANSACTION_CATEGORY}
        options={({ route }) => ({
          title: route.params?.transactionCategoryId ? 'Sửa danh mục' : 'Thêm danh mục',
        })}
        component={UpdateTransactionCategory}
      />
      <TransactionCategoryStack.Screen
        name={ROUTES.PARENT_LIST}
        options={{
          title: 'Chọn nhóm',
        }}
        component={ParentList}
      />
      <TransactionCategoryStack.Screen
        name={ROUTES.ICON_SELECT}
        options={{
          title: 'Chọn icon',
        }}
        component={IconSelect}
      />
    </TransactionCategoryStack.Navigator>
  );
}

export default TransactionCategoryNavigation;
