import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import {
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  TransactionCategoryContext,
  UPDATE_TRANSACTION_CATEGORY,
} from 'utils/constants/navigation.constant';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCustomTheme } from 'resources/theme';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TransactionCategoryListParams } from 'utils/types/navigation';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import LendAndBorrowTab from 'features/TransactionCategory/LendAndBorrowTab';
import ExpenseIncomeTab from 'features/TransactionCategory/ExpenseIncomeTab';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import Loading from 'components/Loading';
import get from 'lodash/get';
import TransactionCategoryHeaderRight from 'navigation/components/TransactionCategoryHeaderRight';
import styles from './styles';

const TabBar = createMaterialTopTabNavigator<TransactionCategoryListParams>();

const mapTransactionCategoryType = {
  [EXPENSE_CATEGORY]: TRANSACTION_CATEGORY_TYPE.EXPENSE,
  [INCOME_CATEGORY]: TRANSACTION_CATEGORY_TYPE.INCOME,
};

function TransactionCategoryTaBBar({ navigation, route }: any) {
  const { colors } = useCustomTheme();
  const [isUpdate, setIsUpdate] = useState(false);
  const { params } = route;

  const isTabHide = get(params, 'tabHide', false);

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
        <TransactionCategoryHeaderRight
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
          {(!isTabHide || isTabHide !== INCOME_CATEGORY) && (
            <TabBar.Screen name={INCOME_CATEGORY} options={{ title: 'Danh mục thu' }}>
              {() => <ExpenseIncomeTab type={TRANSACTION_CATEGORY_TYPE.INCOME} />}
            </TabBar.Screen>
          )}
          {(!isTabHide || isTabHide !== EXPENSE_CATEGORY) && (
            <TabBar.Screen name={EXPENSE_CATEGORY} options={{ title: 'Danh mục chi' }}>
              {() => <ExpenseIncomeTab type={TRANSACTION_CATEGORY_TYPE.EXPENSE} />}
            </TabBar.Screen>
          )}
          {!isUpdate && !isTabHide && (
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
