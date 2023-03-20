import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNT_PICKER, ADD_TRANSACTION, TRANSACTION_CATEGORY } from 'navigation/constants';
import { TransactionParamList } from 'navigation/types';
import { HEADER_TITLE } from 'resources/theme/constants';
import { useCustomTheme } from 'resources/theme';

// import route component
import { Done, Cancel, SelectTransactionType } from 'navigation/common';
import AddTransactions from 'features/Transaction/AddTransaction';
import AccountPicker from 'features/Transaction/AccountPicker';
import TransactionCategoryNavigation from 'navigation/TransactionCategory';

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
      <TransactionStack.Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <TransactionStack.Screen
          name={ACCOUNT_PICKER}
          component={AccountPicker}
          options={{
            title: 'Chọn tài khoản',
            headerTitleStyle: { fontSize: HEADER_TITLE },
            headerRight: () => <Cancel />,
          }}
        />
        <TransactionStack.Screen
          name={TRANSACTION_CATEGORY}
          component={TransactionCategoryNavigation}
          options={{ headerShown: false }}
        />
      </TransactionStack.Group>
    </TransactionStack.Navigator>
  );
}

export default TransactionNavigation;
