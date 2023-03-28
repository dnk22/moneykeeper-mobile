import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import FinancialStatement from 'features/Dashboard/Widgets/FinancialStatement';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import RecentTransactions from 'features/Dashboard/Widgets/RecentTransactions';

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
      {/* <View style={styles.oval1} />
      <View style={styles.oval2} /> */}
    </SafeAreaView>
  );
}

export default Dashboard;
