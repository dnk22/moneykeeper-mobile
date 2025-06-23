import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { ROUTES } from 'navigation/constants/routes';

import Card from './Card';
import styles from './styles';

const data = [
  {
    name: 'Tổng quan tài sản',
    link: ROUTES.FINANCE_STATEMENT,
    icon: 'statementReport',
  },
  {
    name: 'Thu & Chi',
    link: ROUTES.EXPENSE_INCOME_REPORT,
    icon: 'expenseIncomeReport',
  },
  {
    name: 'Phân tích thu & chi',
    link: ROUTES.EXPENSE_INCOME_ANALYZE,
    icon: 'expenseIncomeAnalyzeReport',
  },
  {
    name: 'Theo dõi vay nợ',
    link: ROUTES.DEBT_LOAN_REPORT,
    icon: 'debtLoanReport',
  },
  {
    name: 'Danh bạ thu/chi',
    link: ROUTES.CONTACT_REPORT,
    icon: 'contactBookReport',
  },
];
function HomeReport() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.list}>
        <View style={styles.row}>
          {data.map((item) => {
            return (
              <View key={item.link}>
                <Card item={item} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeReport;
