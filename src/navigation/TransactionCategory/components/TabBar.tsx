import { useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import {
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  TRANSACTION_CATEGORY_LIST,
  UPDATE_TRANSACTION_CATEGORY,
} from 'navigation/constants';
import { Loading, PressableHaptic, SvgIcon } from 'components/index';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCustomTheme } from 'resources/theme';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'store/index';
import { updateTabView } from 'store/transactionCategory/transactionCategory.slice';
import { TransactionCategoryListParams, TransactionCategoryParamProps } from 'navigation/types';
import { selectUpdateModeStatus } from 'store/transactionCategory/transactionCategory.selector';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import CategoryTab from 'features/TransactionCategory/CategoryTab';
import styles from '../styles';

const TabBar = createMaterialTopTabNavigator<TransactionCategoryListParams>();

type TransactionCategoryTapBarProps = {
  route: TransactionCategoryParamProps<typeof TRANSACTION_CATEGORY_LIST>['route'];
  navigation: any;
};

function TransactionCategoryTapBar({ route, navigation }: TransactionCategoryTapBarProps) {
  const useDispatch = useAppDispatch();
  const { colors } = useCustomTheme();
  const isUpdateMode = useAppSelector((state) => selectUpdateModeStatus(state));

  const tabBarOptions = {
    tabBarPressOpacity: 0.7,
    lazy: true,
    lazyPlaceholder: () => <Loading />,
    tabBarStyle: { backgroundColor: colors.surface },
  };

  useEffect(() => {
    updateTabActive(route);
  }, [navigation, route]);

  function updateTabActive(route: any) {
    const routeName = focusedRoute(route);
    switch (routeName) {
      case INCOME_CATEGORY:
        useDispatch(updateTabView(TRANSACTION_CATEGORY_TYPE.INCOME));
        navigation.setOptions({ headerTitle: 'Danh Mục Thu' });
        break;
      case EXPENSE_CATEGORY:
        navigation.setOptions({ headerTitle: 'Danh Mục Chi' });
        useDispatch(updateTabView(TRANSACTION_CATEGORY_TYPE.EXPENSE));
        break;
      default:
        useDispatch(updateTabView(TRANSACTION_CATEGORY_TYPE.LEND_BORROW));
        navigation.setOptions({ headerTitle: 'Danh Mục Vay Mượn' });
        break;
    }
  }

  const focusedRoute = useCallback(
    (route: any) => getFocusedRouteNameFromRoute(route) ?? EXPENSE_CATEGORY,
    [route],
  );

  const handleOnNavigateToScreenAdd = () => {
    navigation.navigate(UPDATE_TRANSACTION_CATEGORY);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {focusedRoute(route) !== LEND_BORROW && isUpdateMode && (
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
  );
}

export default TransactionCategoryTapBar;
