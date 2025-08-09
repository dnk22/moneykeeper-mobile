import React, { createContext, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { ROUTES } from 'navigation/constants/routes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCustomTheme } from 'resources/theme';
import { TransactionCategoryParamProps, TransactionCategoryTabsParams } from 'navigation/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import LendAndBorrowTab from 'features/transaction/TransactionCategory/LendAndBorrowTab';
import ExpenseIncomeTab from 'features/transaction/TransactionCategory/ExpenseIncomeTab';
import Loading from 'components/Loading';

const TabBar = createMaterialTopTabNavigator<TransactionCategoryTabsParams>();

export const CategoryContext = createContext<{
  isUpdate: boolean;
  setUpdateMode: (value: boolean) => void;
}>({ isUpdate: false, setUpdateMode: () => {} });

function TransactionCategoryTabs({
  route,
}: {
  route: TransactionCategoryParamProps<typeof ROUTES.TRANSACTION_CATEGORY_TABS>['route'];
}) {
  const [isUpdate, setUpdateMode] = useState<boolean>(false);
  const { colors } = useCustomTheme();
  const { params } = route;
  const tabsHide = params?.tabsHide;

  return (
    <CategoryContext.Provider value={{ isUpdate, setUpdateMode }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
        <TabBar.Navigator
          initialRouteName={ROUTES.EXPENSE_CATEGORY}
          tabBarPosition="bottom"
          screenOptions={{
            tabBarPressOpacity: 0.8,
            lazy: true,
            lazyPlaceholder: () => <Loading style={{ flex: 1 }} />,
            tabBarStyle: { backgroundColor: colors.surface },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.text,
            tabBarLabelStyle: {
              fontWeight: '500',
            },
          }}
        >
          {(!tabsHide || tabsHide === TRANSACTION_CATEGORY_TYPE.INCOME) && (
            <TabBar.Screen name={ROUTES.INCOME_CATEGORY} options={{ title: 'Danh mục thu' }}>
              {() => <ExpenseIncomeTab type={TRANSACTION_CATEGORY_TYPE.INCOME} />}
            </TabBar.Screen>
          )}
          {(tabsHide === TRANSACTION_CATEGORY_TYPE.EXPENSE || !tabsHide) && (
            <TabBar.Screen name={ROUTES.EXPENSE_CATEGORY} options={{ title: 'Danh mục chi' }}>
              {() => <ExpenseIncomeTab type={TRANSACTION_CATEGORY_TYPE.EXPENSE} />}
            </TabBar.Screen>
          )}
          {!isUpdate && (
            <TabBar.Screen name={ROUTES.LEND_BORROW} options={{ title: 'Vay mượn' }}>
              {() => <LendAndBorrowTab />}
            </TabBar.Screen>
          )}
        </TabBar.Navigator>
      </SafeAreaView>
    </CategoryContext.Provider>
  );
}

export default TransactionCategoryTabs;
