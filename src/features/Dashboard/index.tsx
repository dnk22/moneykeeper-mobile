import React from 'react';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import FinancialStatement from './Widgets/FinancialStatement';
import RecentTransactions from './Widgets/RecentTransactions';
import ExpenseAndIncome from './Widgets/ExpenseAndIncome';
import styles from './styles';
import Wallets from './Widgets/Wallets';

function Dashboard() {
  const { colors } = useCustomTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FinancialStatement />
      <ScrollView style={styles.widgetView}>
        <ExpenseAndIncome />
        <Wallets />
        <RecentTransactions />
      </ScrollView>
    </View>
  );
}

export default Dashboard;
