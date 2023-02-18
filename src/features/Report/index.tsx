import { View, ScrollView, SafeAreaView } from 'react-native';
import { selectReportViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import Item from './Item';
import styles from './styles';

const datas = [
  {
    name: 'Tình hình tài chính',
    link: 'financial-statement',
    icon: require('assets/images/report/statement.png'),
  },
  {
    name: 'Báo cáo thu chi',
    link: 'income-expense-report',
    icon: require('assets/images/report/expenseIncome.png'),
  },
  {
    name: 'Phân tích thu',
    link: 'income-analyze',
    icon: require('assets/images/report/income.png'),
  },
  {
    name: 'Phân tích chi',
    link: 'expense-analyze',
    icon: require('assets/images/report/expense.png'),
  },
];
function HomeReport() {
  const getReportView = useAppSelector((state) => selectReportViewSettings(state));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.list}>
        <View style={styles.row}>
          {datas.map((item) => {
            return <Item item={item} key={item.link} isGridView={getReportView} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeReport;
