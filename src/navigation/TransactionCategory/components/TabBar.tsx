import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import {
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  TransactionCategoryContext,
  UPDATE_TRANSACTION_CATEGORY,
} from 'navigation/constants';
import { Loading, PressableHaptic, SvgIcon } from 'components/index';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCustomTheme } from 'resources/theme';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TransactionCategoryListParams } from 'navigation/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import UpdateTransactionCategoryHeader from './Update';
import LendAndBorrowTab from 'features/TransactionCategory/LendAndBorrowTab';
import ExpenseIncomeTab from 'features/TransactionCategory/ExpenseIncomeTab';
import styles from '../styles';

const TabBar = createMaterialTopTabNavigator<TransactionCategoryListParams>();

const mapTransactionCategoryType = {
  [EXPENSE_CATEGORY]: TRANSACTION_CATEGORY_TYPE.EXPENSE,
  [INCOME_CATEGORY]: TRANSACTION_CATEGORY_TYPE.INCOME,
};

function TransactionCategoryTaBBar({ navigation, route }: any) {
  const { colors } = useCustomTheme();
  const [isUpdate, setIsUpdate] = useState(false);
  const { params } = route;

  useEffect(() => {
    const routeName = focusedRoute(route);
    const mapTitle: Record<string, string> = {
      [INCOME_CATEGORY]: 'Danh Mục Thu',
      [EXPENSE_CATEGORY]: 'Danh Mục Chi',
      [LEND_BORROW]: 'Danh Mục Vay Mượn',
    };
    navigation.setOptions({
      headerTitle: mapTitle[routeName],
      headerRight: () => (
        <UpdateTransactionCategoryHeader
          isUpdateMode={isUpdate}
          onPress={onHeaderButtonPress}
          show={routeName !== LEND_BORROW}
        />
      ),
    });
  }, [navigation, route]);

  const onHeaderButtonPress = () => {
    setIsUpdate(!isUpdate);
  };

  const focusedRoute = useCallback(
    (route: any) => getFocusedRouteNameFromRoute(route) ?? EXPENSE_CATEGORY,
    [route],
  );

  const handleOnNavigateToScreenAdd = () => {
    navigation.navigate(UPDATE_TRANSACTION_CATEGORY, {
      type: mapTransactionCategoryType[getFocusedRouteNameFromRoute(route)],
    });
  };

  return (
    <TransactionCategoryContext.Provider value={{ isUpdate }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
        {focusedRoute(route) !== LEND_BORROW && isUpdate && (
          <PressableHaptic
            style={[styles.addIcon, { backgroundColor: colors.primary }]}
            onPress={handleOnNavigateToScreenAdd}
          >
            <SvgIcon name="add" color="white" />
          </PressableHaptic>
        )}
        <TabBar.Navigator
          initialRouteName={EXPENSE_CATEGORY}
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
          {(!params.tabHide || params.tabHide !== INCOME_CATEGORY) && (
            <TabBar.Screen name={INCOME_CATEGORY} options={{ title: 'Danh mục thu' }}>
              {() => <ExpenseIncomeTab type={TRANSACTION_CATEGORY_TYPE.INCOME} />}
            </TabBar.Screen>
          )}
          {(!params.tabHide || params.tabHide !== EXPENSE_CATEGORY) && (
            <TabBar.Screen name={EXPENSE_CATEGORY} options={{ title: 'Danh mục chi' }}>
              {() => <ExpenseIncomeTab type={TRANSACTION_CATEGORY_TYPE.EXPENSE} />}
            </TabBar.Screen>
          )}
          {!isUpdate && !params.tabHide && (
            <TabBar.Screen name={LEND_BORROW} options={{ title: 'Vay mượn' }}>
              {() => <LendAndBorrowTab />}
            </TabBar.Screen>
          )}
        </TabBar.Navigator>
      </SafeAreaView>
    </TransactionCategoryContext.Provider>
  );
}

export default TransactionCategoryTaBBar;
