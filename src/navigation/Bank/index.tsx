import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BANK_HOME_LIST } from 'navigation/constants';
import { BankParamList } from 'navigation/types';

// import route component
import BankList from 'features/BankList';

//set up routes
const TransactionStack = createNativeStackNavigator<BankParamList>();

function BankNavigation() {
  const rootOptions = {
    headerShown: false,
  };

  return (
    <TransactionStack.Navigator initialRouteName={BANK_HOME_LIST} screenOptions={rootOptions}>
      <TransactionStack.Screen name={BANK_HOME_LIST} component={BankList} />
    </TransactionStack.Navigator>
  );
}

export default BankNavigation;
