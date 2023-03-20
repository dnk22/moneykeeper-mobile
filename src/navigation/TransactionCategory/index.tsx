import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  PARENT_LIST,
  TRANSACTION_CATEGORY_LIST,
  UPDATE_TRANSACTION_CATEGORY,
} from 'navigation/constants';
import { HEADER_TITLE } from 'resources/theme/constants';
import { TransactionCategoryParamList } from 'navigation/types';
import TransactionCategoryTapBar from './components/TabBar';
import UpdateTransactionCategoryHeader from './components/Update';
import React from 'react';

const UpdateTransactionCategory = React.lazy(() => import('features/TransactionCategory/Update'));
const ParentList = React.lazy(() => import('features/TransactionCategory/ParentList'));

//set up routes
const TransactionCategoryStack = createNativeStackNavigator<TransactionCategoryParamList>();

function TransactionCategoryNavigation() {
  return (
    <TransactionCategoryStack.Navigator initialRouteName={TRANSACTION_CATEGORY_LIST}>
      <TransactionCategoryStack.Screen
        name={TRANSACTION_CATEGORY_LIST}
        component={TransactionCategoryTapBar}
        options={{
          headerTitleStyle: {
            fontSize: HEADER_TITLE,
          },
          headerBackTitleVisible: false,
          headerRight: (props) => <UpdateTransactionCategoryHeader {...props} />,
        }}
      />
      <TransactionCategoryStack.Screen
        name={UPDATE_TRANSACTION_CATEGORY}
        options={({ route }) => ({
          title: route.params?.transactionCategoryId ? 'Sửa danh mục' : 'Thêm danh mục',
        })}
        component={UpdateTransactionCategory}
      />
      <TransactionCategoryStack.Screen
        name={PARENT_LIST}
        options={{
          title: 'Chọn nhóm',
        }}
        component={ParentList}
      />
    </TransactionCategoryStack.Navigator>
  );
}

export default TransactionCategoryNavigation;
