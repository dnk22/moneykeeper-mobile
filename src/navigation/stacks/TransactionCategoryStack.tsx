import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { HEADER_TITLE_FONT_SIZE } from 'resources/theme/constants';
import UpdateTransactionCategory from 'features/transaction/TransactionCategory/Update';
import ParentList from 'features/transaction/TransactionCategory/ParentList';
import IconSelect from 'features/transaction/TransactionCategory/IconSelect';
import { TransactionCategoryParams } from 'navigation/types';
import TransactionCategoryTaBBar from 'navigation/tabs/TransactionCategoryTabs';

//set up routes
const TransactionCategoryStack = createNativeStackNavigator<TransactionCategoryParams>();

function TransactionCategoryNavigation() {
  return (
    <TransactionCategoryStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: HEADER_TITLE_FONT_SIZE,
        },
      }}
      initialRouteName={ROUTES.TRANSACTION_CATEGORY_TABS}
    >
      <TransactionCategoryStack.Screen
        name={ROUTES.TRANSACTION_CATEGORY_TABS}
        component={TransactionCategoryTaBBar}
        options={{
          headerTitleStyle: {
            fontSize: HEADER_TITLE_FONT_SIZE,
          },
        }}
      />
      <TransactionCategoryStack.Screen
        name={ROUTES.UPDATE_TRANSACTION_CATEGORY}
        options={({ route }) => ({
          title:
            route.params && 'transactionCategoryId' in route.params
              ? 'Sửa danh mục'
              : 'Thêm danh mục',
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
