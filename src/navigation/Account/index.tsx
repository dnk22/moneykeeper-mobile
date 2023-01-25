import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SAVINGS, WALLET } from 'navigation/constants';
import Wallet from 'features/Wallet';
import TabBar from './TabBar';

const Tab = createMaterialTopTabNavigator();

function AccountNavigation() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name={WALLET} options={{ title: 'Ví' }} component={Wallet} />
      <Tab.Screen name={SAVINGS} options={{ title: 'Tiết kiệm' }} component={Wallet} />
    </Tab.Navigator>
  );
}
export default AccountNavigation;
