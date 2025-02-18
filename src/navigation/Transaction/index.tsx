import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ADD_TRANSACTION } from 'utils/constants/navigation.constant';
import { TransactionParamList } from 'utils/types/navigation';

// import route component
import AddTransactions from 'features/AddTransaction';
import { useCustomTheme } from 'resources/theme';

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
        }}
      />
    </TransactionStack.Navigator>
  );
}

export default TransactionNavigation;
