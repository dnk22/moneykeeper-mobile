import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SAVINGS, WALLET } from 'navigation/constants';
import Accounts from 'features/Accounts';
import TabBar from '../component/TabBar';
import Savings from 'features/Savings';

const Tab = createMaterialTopTabNavigator();

function AccountTab() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name={WALLET} options={{ title: 'Ví Tiền' }} component={Accounts} />
      <Tab.Screen name={SAVINGS} options={{ title: 'Sổ Tiết kiệm' }} component={Savings} />
    </Tab.Navigator>
  );
}
export default AccountTab;
