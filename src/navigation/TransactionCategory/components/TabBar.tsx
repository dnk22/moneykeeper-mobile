import React, { createContext, useCallback, useEffect, useState } from 'react';
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
import { TransactionCategoryListParams } from 'navigation/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import CategoryTab from 'features/TransactionCategory';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import UpdateTransactionCategoryHeader from './Update';
import styles from '../styles';


const TabBar = createMaterialTopTabNavigator<TransactionCategoryListParams>();
const mapTransactionCategoryType = {
  [EXPENSE_CATEGORY]: TRANSACTION_CATEGORY_TYPE.EXPENSE,
  [INCOME_CATEGORY]: TRANSACTION_CATEGORY_TYPE.INCOME,
  [LEND_BORROW]: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
};

function TransactionCategoryTapBar({ navigation, route }: any) {
  const { colors } = useCustomTheme();
  const [isUpdate, setIsUpdate] = useState(false);

  const tabBarOptions = {
    tabBarPressOpacity: 0.7,
    lazy: true,
    lazyPlaceholder: () => <Loading />,
    tabBarStyle: { backgroundColor: colors.surface },
  };

  useEffect(() => {
    updateTabActive(route);
  }, [navigation, route, isUpdate]);

  function updateTabActive(route: any) {
    const routeName = focusedRoute(route);
    switch (routeName) {
      case INCOME_CATEGORY:
        navigation.setOptions({
          headerTitle: 'Danh Mục Thu',
          headerRight: () => (
            <UpdateTransactionCategoryHeader
              isUpdateMode={isUpdate}
              onPress={onHeaderButtonPress}
            />
          ),
        });
        break;
      case EXPENSE_CATEGORY:
        navigation.setOptions({
          headerTitle: 'Danh Mục Chi',
          headerRight: () => (
            <UpdateTransactionCategoryHeader
              isUpdateMode={isUpdate}
              onPress={onHeaderButtonPress}
            />
          ),
        });
        break;
      default:
        navigation.setOptions({ headerTitle: 'Danh Mục Vay Mượn', headerRight: () => <></> });
        break;
    }
  }

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
    </TransactionCategoryContext.Provider>
  );
}

export default TransactionCategoryTapBar;
