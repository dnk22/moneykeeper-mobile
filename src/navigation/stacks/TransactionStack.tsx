import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';

// import route component
import AddTransactions from 'features/transaction/AddTransaction';
import { useCustomTheme } from 'resources/theme';

//set up routes
const TransactionStack = createNativeStackNavigator<TransactionParamList>();

function TransactionNavigation() {
  const { colors } = useCustomTheme();

  return (
    <TransactionStack.Navigator initialRouteName={ROUTES.ADD_TRANSACTION}>
      <TransactionStack.Screen
        name={ROUTES.ADD_TRANSACTION}
        component={AddTransactions}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
        }}
      />
    </TransactionStack.Navigator>
  );
}

export default TransactionNavigation;
