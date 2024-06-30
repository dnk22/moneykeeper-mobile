import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect } from '@react-navigation/native';
import { RNText } from 'components/index';
import { queryGetExpenseIncomeReportByCurrentDate } from 'database/querying';
import { showToast } from 'utils/system';
import { formatNumber } from 'utils/math';
import styles from '../styles';

function Item({
  title,
  startDate = new Date(),
  endDate = new Date(),
}: {
  title: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const { colors } = useCustomTheme();
  const [data, setData] = useState({ totalIncome: 0, totalExpense: 0 });

  useFocusEffect(
    useCallback(() => {
      queryGetExpenseIncomeReportByCurrentDate({
        startDate,
        endDate,
      })
        .then((res) => {
          setData(res[0]);
        })
        .catch((err) => {
          console.log(err);
          showToast({ type: 'error', text2: 'Vui lòng tải lại!' });
        });
    }, [startDate, endDate]),
  );

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText preset="widgetTitle" color={colors.primary}>
        {title}
      </RNText>
      <View style={styles.itemDetail}>
        <View style={styles.col}>
          <RNText style={styles.itemTitle} fontSize={15}>
            Thu
          </RNText>
          <RNText color={colors.success}>{formatNumber(data?.totalIncome || 0, true)}</RNText>
        </View>
        <View style={styles.col}>
          <RNText style={styles.itemTitle} fontSize={15}>
            Chi
          </RNText>
          <RNText color={colors.error}>{formatNumber(data?.totalExpense || 0, true)}</RNText>
        </View>
        <View style={styles.col}>
          <RNText style={styles.itemTitle} fontSize={15}>
            Dư
          </RNText>
          <RNText>
            {formatNumber((data?.totalIncome || 0) - (data?.totalExpense || 0), true)}
          </RNText>
        </View>
      </View>
    </View>
  );
}

export default Item;
