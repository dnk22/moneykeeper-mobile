import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalStackParamList } from 'utils/types/navigation/modalStack';
import {
  BANK_NAVIGATION,
  TRANSACTION_CATEGORY,
  WIDGET_SETTINGS,
} from 'utils/constants/navigation.constant';
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
      <ModalStack.Screen name={BANK_NAVIGATION} component={BankNavigation} />
      <ModalStack.Screen name={TRANSACTION_CATEGORY} component={TransactionCategoryNavigation} />
      <ModalStack.Screen
        name={WIDGET_SETTINGS}
        component={WidgetSettings}
        options={{
          title: 'Chỉnh sửa DS Widget',
          presentation: 'containedModal',
        }}
      />
    </ModalStack.Navigator>
  );
}
