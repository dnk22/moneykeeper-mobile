import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BankStackParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';

// import route component
import BankList from 'features/BankList';
import { BANK_TYPE } from 'utils/constants/account';

//set up routes
const TransactionStack = createNativeStackNavigator<BankStackParamList>();

function BankNavigation() {
  return (
    <TransactionStack.Navigator initialRouteName={ROUTES.BANK_HOME_LIST}>
      <TransactionStack.Screen
        name={ROUTES.BANK_HOME_LIST}
        component={BankList}
        options={({ route }) => ({
          title: route.params?.type !== BANK_TYPE.BANK ? 'Nhà cung cấp' : 'Ngân hàng',
        })}
      />
    </TransactionStack.Navigator>
  );
}

export default BankNavigation;
