import React from 'react';
import { ScrollView, View } from 'react-native';
import FinancialStatement from 'features/Dashboard/Widgets/FinancialStatement';
import { useCustomTheme } from 'resources/theme';
import RecentTransactions from 'features/Dashboard/Widgets/RecentTransactions';
import styles from './styles';

function Dashboard() {
  const { colors } = useCustomTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FinancialStatement />
      <ScrollView>
        <RecentTransactions />
      </ScrollView>
    </View>
  );
}

export default Dashboard;
