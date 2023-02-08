import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import FinancialStatement from 'modules/DashboardWidget/FinancialStatement';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import RecentTransactions from 'modules/DashboardWidget/RecentTransactions';

function Dashboard() {
  const { colors } = useCustomTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FinancialStatement />
        <ScrollView style={{ paddingTop: 160 }}>
          <RecentTransactions />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Dashboard;
