import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ACCOUNT_PICKER,
  APPEARANCE,
  BANK_NAVIGATION,
  HOME,
  TRANSACTION_CATEGORY,
} from './constants';
import { RootStackParamList } from './types';
import { HEADER_TITLE_FONT_SIZE } from 'resources/theme/constants';

import { Cancel } from './elements';
import TransactionCategoryNavigation from './TransactionCategory';

import HomeNavigation from './Home';
import BankNavigation from './Bank';
import AccountPicker from 'features/Transaction/AccountPicker';
import Appearance from 'features/Settings/Appearance';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  return (
    <RootStack.Navigator
      initialRouteName={HOME}
      screenOptions={{ headerShown: false, autoHideHomeIndicator: true }}
    >
      <RootStack.Screen
        name={HOME}
        component={HomeNavigation}
        options={{ headerBackTitleVisible: false }}
      />
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name={BANK_NAVIGATION} component={BankNavigation} />
        <RootStack.Screen
          name={ACCOUNT_PICKER}
          component={AccountPicker}
          options={{
            headerShown: true,
            title: 'Chọn tài khoản',
            headerTitleStyle: { fontSize: HEADER_TITLE_FONT_SIZE },
            headerRight: () => <Cancel />,
          }}
        />
        <RootStack.Screen name={TRANSACTION_CATEGORY} component={TransactionCategoryNavigation} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ headerShown: true }}>
        <RootStack.Screen
          name={APPEARANCE}
          component={Appearance}
          options={{
            title: 'Giao diện',
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}

export default AppNavigators;
