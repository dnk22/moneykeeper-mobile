import React from 'react';
import { SafeAreaView } from 'react-native';
import { EXPENSE_CATEGORY, INCOME_CATEGORY, LEND_BORROW } from 'navigation/constants';
import { Loading } from 'components/index';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCustomTheme } from 'resources/theme';
import { TransactionCategoryListParams } from 'navigation/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import CategoryTab from 'features/TransactionCategory';

const TabBar = createMaterialTopTabNavigator<TransactionCategoryListParams>();

function TransactionCategoryTapBar() {
  const { colors } = useCustomTheme();

  const tabBarOptions = {
    tabBarPressOpacity: 0.7,
    lazy: true,
    lazyPlaceholder: () => <Loading />,
    tabBarStyle: { backgroundColor: colors.surface },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <TabBar.Navigator
        initialRouteName={EXPENSE_CATEGORY}
        tabBarPosition="bottom"
        screenOptions={tabBarOptions}
      >
        <TabBar.Screen name={INCOME_CATEGORY} options={{ title: 'Danh mục thu' }}>
          {(props) => <CategoryTab {...props} type={TRANSACTION_CATEGORY_TYPE.INCOME} />}
        </TabBar.Screen>
        <TabBar.Screen name={EXPENSE_CATEGORY} options={{ title: 'Danh mục chi' }}>
          {(props) => <CategoryTab {...props} type={TRANSACTION_CATEGORY_TYPE.EXPENSE} />}
        </TabBar.Screen>
        <TabBar.Screen name={LEND_BORROW} options={{ title: 'Vay mượn' }}>
          {(props) => <CategoryTab {...props} type={TRANSACTION_CATEGORY_TYPE.LEND_BORROW} />}
        </TabBar.Screen>
      </TabBar.Navigator>
    </SafeAreaView>
  );
}

export default TransactionCategoryTapBar;
