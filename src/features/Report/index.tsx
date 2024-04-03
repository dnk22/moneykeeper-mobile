import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { selectReportViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import { CONTACT_REPORT, DEBT_LOAN_REPORT, EXPENSE_INCOME_ANALYZE, EXPENSE_INCOME_REPORT, FINANCE_STATEMENT } from 'navigation/constants';
import Card from './Card';
import styles from './styles';

const data = [
  {
    name: 'Tổng quan tài sản',
    link: FINANCE_STATEMENT,
    icon: 'statementReport',
  },
  {
    name: 'Thu & Chi',
    link: EXPENSE_INCOME_REPORT,
    icon: 'expenseIncomeReport',
  },
  {
    name: 'Phân tích thu & chi',
    link: EXPENSE_INCOME_ANALYZE,
    icon: 'incomeReport',
  },
  {
    name: 'Theo dõi vay nợ',
    link: DEBT_LOAN_REPORT,
    icon: 'expenseReport',
  },
  {
    name: 'Danh bạ thu/chi',
    link: CONTACT_REPORT,
    icon: 'expenseReport',
  },
];
function HomeReport() {
  const getReportView = useAppSelector((state) => selectReportViewSettings(state));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.list}>
        <View style={styles.row}>
          {data.map((item) => {
            return (
              <View key={item.link}>
                <Card item={item} isGridView={getReportView} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeReport;
