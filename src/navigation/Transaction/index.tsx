import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ADD_TRANSACTION } from 'navigation/constants';
import { TransactionParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';

// import route component
import { Done, SelectTransactionType } from 'navigation/elements';
import AddTransactions from 'features/Transaction/AddTransaction';

//set up routes
const TransactionStack = createNativeStackNavigator<TransactionParamList>();

function TransactionNavigation() {
  const { colors } = useCustomTheme();

  return (
    <TransactionStack.Navigator initialRouteName={ADD_TRANSACTION}>
      <TransactionStack.Screen
        name={ADD_TRANSACTION}
        component={AddTransactions}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitle: () => <SelectTransactionType />,
          headerRight: () => <Done />,
        }}
      />
    </TransactionStack.Navigator>
  );
}

export default TransactionNavigation;
