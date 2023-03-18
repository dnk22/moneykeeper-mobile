import { SafeAreaView } from 'react-native';
import { ExpenseCategory, IncomeCategory } from 'features/TransactionCategory';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { EXPENSE_CATEGORY, INCOME_CATEGORY, LEND_BORROW } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import Loading from 'components/Loading';
import styles from '../TransactionCategory/styles';

const Tab = createMaterialTopTabNavigator();

function TransactionCategoryTopBar() {
  const { colors } = useCustomTheme();

  const tabBarOptions = {
    tabBarAllowFontScaling: false,
    tabBarPressOpacity: 0.7,
    lazy: true,
    lazyPlaceholder: () => <Loading />,
    tabBarStyle: { backgroundColor: colors.surface },
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, { backgroundColor: colors.surface }]}>
      <Tab.Navigator
        initialRouteName={EXPENSE_CATEGORY}
        tabBarPosition="bottom"
        screenOptions={tabBarOptions}
      >
        <Tab.Screen
          name={EXPENSE_CATEGORY}
          options={{ title: 'Danh mục chi' }}
          component={ExpenseCategory}
        />
        <Tab.Screen
          name={INCOME_CATEGORY}
          options={{ title: 'Danh mục thu' }}
          component={IncomeCategory}
        />
        <Tab.Screen name={LEND_BORROW} options={{ title: 'Vay mượn' }} component={IncomeCategory} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default TransactionCategoryTopBar;
