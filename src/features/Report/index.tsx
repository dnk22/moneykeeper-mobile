import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { selectReportViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import { FINANCE_STATEMENT } from 'navigation/constants';
import Card from './Card';
import styles from './styles';

const data = [
  {
    name: 'Tổng quan tài sản',
    link: FINANCE_STATEMENT,
    icon: 'statementReport',
  },
  {
    name: 'Phân tích',
    link: 'income-expense-report',
    icon: 'expenseIncomeReport',
  },
  {
    name: 'Phân tích thu',
    link: 'income-analyze',
    icon: 'incomeReport',
  },
  {
    name: 'Phân tích chi',
    link: 'expense-analyze',
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
