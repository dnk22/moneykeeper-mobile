import { View, ScrollView, SafeAreaView } from 'react-native';
import { selectReportViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import Item from './Item';
import styles from './styles';

const datas = [
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
          {datas.map((item) => {
            return <Item item={item} key={item.link} isGridView={getReportView} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeReport;
