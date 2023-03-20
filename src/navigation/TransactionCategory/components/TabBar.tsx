import { useCallback, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ExpenseCategory, IncomeCategory, LendBorrowCategory } from 'features/TransactionCategory';
import {
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  UPDATE_TRANSACTION_CATEGORY,
} from 'navigation/constants';
import { Loading, PressableHaptic, SvgIcon } from 'components/index';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import styles from '../styles';
import { useCustomTheme } from 'resources/theme';
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from '@react-navigation/native';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import { useAppDispatch } from 'store/index';
import { updateTabView } from 'store/transactionCategory/transactionCategory.slice';

const TabBar = createMaterialTopTabNavigator();

function TransactionCategoryTapBar() {
  const route = useRoute();
  const navigation = useNavigation();
  const useDispatch = useAppDispatch();
  const { colors } = useCustomTheme();

  const tabBarOptions = {
    tabBarAllowFontScaling: false,
    tabBarPressOpacity: 0.7,
    lazy: true,
    lazyPlaceholder: () => <Loading />,
    tabBarStyle: { backgroundColor: colors.surface },
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: updateTabActive(route) });
  }, [navigation, route]);

  const focusedRoute = useCallback(
    (route: any) => getFocusedRouteNameFromRoute(route) ?? EXPENSE_CATEGORY,
    [route],
  );

  const handleOnNavigateToScreenAdd = () => {
    navigation.navigate(UPDATE_TRANSACTION_CATEGORY);
  };

  function updateTabActive(route: any) {
    const routeName = focusedRoute(route);
    switch (routeName) {
      case INCOME_CATEGORY:
        useDispatch(updateTabView(TRANSACTION_CATEGORY_TYPE.INCOME));
        return 'Danh Mục Thu';
      case EXPENSE_CATEGORY:
        useDispatch(updateTabView(TRANSACTION_CATEGORY_TYPE.EXPENSE));
        return 'Danh Mục Chi';
      default:
        break;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {focusedRoute(route) !== LEND_BORROW && (
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
        screenOptions={tabBarOptions}
      >
        <TabBar.Screen
          name={EXPENSE_CATEGORY}
          options={{ title: 'Danh mục chi' }}
          component={ExpenseCategory}
        />
        <TabBar.Screen
          name={INCOME_CATEGORY}
          options={{ title: 'Danh mục thu' }}
          component={IncomeCategory}
        />
        <TabBar.Screen
          name={LEND_BORROW}
          options={{ title: 'Vay mượn' }}
          component={LendBorrowCategory}
        />
      </TabBar.Navigator>
    </SafeAreaView>
  );
}

export default TransactionCategoryTapBar;
