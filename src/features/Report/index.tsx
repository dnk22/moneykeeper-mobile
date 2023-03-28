import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { selectReportViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import Item from './Item';
import styles from './styles';

const data = [
  {
    name: 'Tình hình tài chính',
    link: 'financial-statement',
    icon: 'statementReport',
  },
  {
    name: 'Báo cáo thu chi',
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
          {data.map((item, key) => {
            return (
              <View key={item.link}>
                <Item item={item} isGridView={getReportView} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeReport;
