import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BANK_HOME_LIST } from 'navigation/constants';
import { BankParams } from 'navigation/types';

// import route component
import BankList from 'features/BankList';

//set up routes
const TransactionStack = createNativeStackNavigator<BankParams>();

function BankNavigation() {
  return (
    <TransactionStack.Navigator initialRouteName={BANK_HOME_LIST}>
      <TransactionStack.Screen
        name={BANK_HOME_LIST}
        component={BankList}
        options={({ route }) => ({
          title: route.params?.isWallet ? 'Nhà cung cấp' : 'Ngân hàng',
        })}
      />
    </TransactionStack.Navigator>
  );
}

export default BankNavigation;
