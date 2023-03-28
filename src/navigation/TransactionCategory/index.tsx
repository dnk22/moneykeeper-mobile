import { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ICON_SELECT,
  PARENT_LIST,
  TRANSACTION_CATEGORY_LIST,
  UPDATE_TRANSACTION_CATEGORY,
} from 'navigation/constants';
import { HEADER_TITLE_FONT_SIZE } from 'resources/theme/constants';
import { TransactionCategoryParams } from 'navigation/types';
import TransactionCategoryTapBar from './components/TabBar';
import UpdateTransactionCategoryHeader from './components/Update';
import UpdateTransactionCategory from 'features/TransactionCategory/Update';
import ParentList from 'features/TransactionCategory/ParentList';
import IconSelect from 'features/TransactionCategory/IconSelect';
import { useAppSelector } from 'store/index';
import { selectTabActive } from 'store/transactionCategory/transactionCategory.selector';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

//set up routes
const TransactionCategoryStack = createNativeStackNavigator<TransactionCategoryParams>();

function TransactionCategoryNavigation() {
  const isTabActive = useAppSelector((state) => selectTabActive(state));
  const UpdateButton = useMemo(
    () =>
      isTabActive !== TRANSACTION_CATEGORY_TYPE.LEND_BORROW ? (
        <UpdateTransactionCategoryHeader />
      ) : (
        <></>
      ),
    [isTabActive],
  );

  return (
    <TransactionCategoryStack.Navigator initialRouteName={TRANSACTION_CATEGORY_LIST}>
      <TransactionCategoryStack.Screen
        name={TRANSACTION_CATEGORY_LIST}
        component={TransactionCategoryTapBar}
        options={{
          headerTitleStyle: {
            fontSize: HEADER_TITLE_FONT_SIZE,
          },
          headerBackTitleVisible: false,
          headerRight: () => UpdateButton,
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
