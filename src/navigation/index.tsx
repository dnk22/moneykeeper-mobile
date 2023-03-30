import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNT_PICKER, BANK_NAVIGATION, HOME, TRANSACTION_CATEGORY } from './constants';
import { RootStackParamList } from './types';

import HomeNavigation from './Home';
import BankNavigation from './Bank';
import AccountPicker from 'features/Transaction/AccountPicker';
import TransactionCategoryNavigation from './TransactionCategory';
import { Cancel } from './elements';
import { HEADER_TITLE } from 'resources/theme/constants';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  return (
    <RootStack.Navigator
      initialRouteName={HOME}
      screenOptions={{ headerShown: false, autoHideHomeIndicator: true }}
    >
      <RootStack.Screen name={HOME} component={HomeNavigation} />
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name={BANK_NAVIGATION} component={BankNavigation} />
        <RootStack.Screen
          name={ACCOUNT_PICKER}
          component={AccountPicker}
          options={{
            headerShown: true,
            title: 'Chọn tài khoản',
            headerTitleStyle: { fontSize: HEADER_TITLE },
            headerRight: () => <Cancel />,
          }}
        />
        <RootStack.Screen
          name={TRANSACTION_CATEGORY}
          component={TransactionCategoryNavigation}
          options={{ headerShown: false }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}

export default AppNavigators;
