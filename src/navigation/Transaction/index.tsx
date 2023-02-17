import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNT_PICKER, ADD_TRANSACTION, TRANSACTION_CATEGORY } from 'navigation/constants';
import { TransactionParamList } from 'navigation/types';

// import route component
import AddTransactions from 'features/Transaction/AddTransaction';
import AccountPicker from 'features/Transaction/AccountPicker';
import TransactionCategoryNavigation from './TransactionCategory/Index';

//set up routes
const TransactionStack = createNativeStackNavigator<TransactionParamList>();

function TransactionNavigation() {
  const rootOptions = {
    headerShown: false,
  };

  return (
    <TransactionStack.Navigator initialRouteName={ADD_TRANSACTION} screenOptions={rootOptions}>
      <TransactionStack.Screen name={ADD_TRANSACTION} component={AddTransactions} />
      <TransactionStack.Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <TransactionStack.Screen
          name={ACCOUNT_PICKER}
          component={AccountPicker}
          options={{ headerShown: true, title: 'Chọn tài khoản' }}
        />
        <TransactionStack.Screen
          name={TRANSACTION_CATEGORY}
          component={TransactionCategoryNavigation}
        />
      </TransactionStack.Group>
    </TransactionStack.Navigator>
  );
}

export default TransactionNavigation;
