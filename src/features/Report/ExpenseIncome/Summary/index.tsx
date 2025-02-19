import { useCallback, useState } from 'react';
import { View } from 'react-native';
import FlatListComponent from 'components/FlatList';
import { endOfYear, startOfYear } from 'date-fns';
import { formatDateLocal } from 'utils/date';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect } from '@react-navigation/native';
import {
  TQueryGetExpenseIncomeReportGroupByDate,
  queryGetExpenseIncomeReportGroupByDate,
} from 'database/querying';
import { VIEW_EXPENSE_INCOME_REPORT_BY } from 'utils/constants';
import { showToast } from 'utils/system';
import Item from './Item';
import styles from '../styles';
import BarChartComponent from './BarChart';
import DateFilter, { DateProps } from './DateFilter';

function Summary({ type }: { type: VIEW_EXPENSE_INCOME_REPORT_BY }) {
  const { colors } = useCustomTheme();
  const [data, setData] = useState<TQueryGetExpenseIncomeReportGroupByDate[]>([]);
  const [date, setDate] = useState<DateProps>({
    startDate: new Date(),
    endDate: new Date(),
  });

  useFocusEffect(
    useCallback(() => {
      queryGetExpenseIncomeReportGroupByDate({
        type,
        startDate: new Date(formatDateLocal(startOfYear(new Date()), 'yyyy-MM-dd')),
        endDate: new Date(formatDateLocal(endOfYear(new Date()), 'yyyy-MM-dd')),
      })
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.log(err);
          showToast({ type: 'error', text2: 'Vui lòng tải lại!' });
        });
    }, [type, date]),
  );

  const onDateChange = () => {};

  const renderItem = ({ item }: { item: TQueryGetExpenseIncomeReportGroupByDate }) => (
    <Item data={item} type={type} />
  );

  return (
    <View style={styles.container}>
      <DateFilter value={date} colors={colors} type={type} onChange={onDateChange} />
      <BarChartComponent data={data} type={type} />
      <FlatListComponent id="date" data={data} renderItem={renderItem} />
    </View>
  );
}

export default Summary;
