import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ICON_SELECT,
  PARENT_LIST,
  TRANSACTION_CATEGORY_LIST,
  UPDATE_TRANSACTION_CATEGORY,
} from 'navigation/constants';
import { HEADER_TITLE } from 'resources/theme/constants';
import { TransactionCategoryParams } from 'navigation/types';
import TransactionCategoryTapBar from './components/TabBar';
import UpdateTransactionCategoryHeader from './components/Update';
import UpdateTransactionCategory from 'features/TransactionCategory/Update';
import ParentList from 'features/TransactionCategory/ParentList';
import IconSelect from 'features/IconSelect';

//set up routes
const TransactionCategoryStack = createNativeStackNavigator<TransactionCategoryParams>();

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
          headerRight: () => <UpdateTransactionCategoryHeader />,
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
      <TransactionCategoryStack.Screen
        name={ICON_SELECT}
        options={{
          title: 'Chọn icon',
        }}
        component={IconSelect}
      />
    </TransactionCategoryStack.Navigator>
  );
}

export default TransactionCategoryNavigation;
