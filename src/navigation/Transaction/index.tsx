import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNT_PICKER, ADD_TRANSACTION } from 'navigation/constants';

// import route component
import AddTransactions from 'features/Transaction/AddTransaction';
import AccountPicker from 'features/Transaction/AccountPicker';

//set up routes
const AddTransactionStack = createNativeStackNavigator<any>();

function TransactionNavigation() {
  const rootOptions = {};

  return (
    <AddTransactionStack.Navigator initialRouteName={ADD_TRANSACTION} screenOptions={rootOptions}>
      <AddTransactionStack.Screen
        name={ADD_TRANSACTION}
        component={AddTransactions}
        options={{ headerShown: false }}
      />
      <AddTransactionStack.Screen
        name={ACCOUNT_PICKER}
        component={AccountPicker}
        options={{ presentation: 'modal', title: 'Chọn tài khoản' }}
      />
    </AddTransactionStack.Navigator>
  );
}

export default TransactionNavigation;
