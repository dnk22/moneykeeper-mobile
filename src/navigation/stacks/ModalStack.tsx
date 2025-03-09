import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalStackParamList } from 'navigation/types/modalStack';
import { ROUTES } from 'navigation/constants/routes';
import WidgetSettings from 'features/Dashboard/WidgetSettings';
import BankNavigation from './BankStack';
import TransactionCategoryNavigation from './TransactionCategoryStack';

const ModalStack = createNativeStackNavigator<ModalStackParamList>();

export default function ModalStackScreen() {
  return (
    <ModalStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <ModalStack.Screen name={ROUTES.BANK_NAVIGATION} component={BankNavigation} />
      <ModalStack.Screen
        name={ROUTES.TRANSACTION_CATEGORY}
        component={TransactionCategoryNavigation}
      />
      <ModalStack.Screen
        name={ROUTES.WIDGET_SETTINGS}
        component={WidgetSettings}
        options={{
          title: 'Chỉnh sửa DS Widget',
          presentation: 'containedModal',
        }}
      />
    </ModalStack.Navigator>
  );
}
