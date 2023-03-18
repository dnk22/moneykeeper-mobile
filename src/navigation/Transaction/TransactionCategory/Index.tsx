import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TRANSACTION_CATEGORY_LIST, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { TransactionCategoryParamList } from 'navigation/types';
import { UpdateTransactionCategory } from 'features/TransactionCategory';
import TransactionCategoryTopBar from '../components/TopBar';
import UpdateTransactionCategoryHeader from '../components/Update.header';

//set up routes
const TransactionCategoryStack = createNativeStackNavigator<TransactionCategoryParamList>();

function TransactionCategoryNavigation() {
  return (
    <TransactionCategoryStack.Navigator initialRouteName={TRANSACTION_CATEGORY_LIST}>
      <TransactionCategoryStack.Screen
        name={TRANSACTION_CATEGORY_LIST}
        component={TransactionCategoryTopBar}
        options={{
          title: 'Danh mục',
          headerBackTitleVisible: false,
          headerRight: (props) => <UpdateTransactionCategoryHeader {...props} />,
        }}
      />
      <TransactionCategoryStack.Screen
        name={UPDATE_TRANSACTION_CATEGORY}
        options={({ route }) => ({
          title: route.params?.transaction_categoryid ? 'Sửa danh mục' : 'Thêm danh mục',
          // headerSearchBarOptions: {
          //   placeholder: 'hihi',
          // },
        })}
        component={UpdateTransactionCategory}
      />
    </TransactionCategoryStack.Navigator>
  );
}

export default TransactionCategoryNavigation;
