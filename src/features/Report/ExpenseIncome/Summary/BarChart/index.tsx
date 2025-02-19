import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';

import { TQueryGetExpenseIncomeReportGroupByDate } from 'database/querying';
import { VIEW_EXPENSE_INCOME_REPORT_BY } from 'utils/constants';
import { formatDateLocal } from 'utils/date';
import styles from './styles';

function BarChartComponent({
  data = [],
  type,
}: {
  data: TQueryGetExpenseIncomeReportGroupByDate[];
  type: VIEW_EXPENSE_INCOME_REPORT_BY;
}) {
  const { colors } = useCustomTheme();

  const formatDateByType =
    type === VIEW_EXPENSE_INCOME_REPORT_BY.MONTH
      ? 'MMM'
      : type === VIEW_EXPENSE_INCOME_REPORT_BY.QUARTER
      ? 'qqqq'
      : 'yyyy';

  const dataFormatted = [...data].reverse().map((item) => [
    {
      value: item.totalIncome,
      label: formatDateLocal(item.date, formatDateByType),
      spacing: 4,
      labelWidth: 40,
      labelTextStyle: { color: 'gray' },
      frontColor: colors.success,
    },
    { value: item.totalExpense, frontColor: colors.error },
  ]);

  const formatYLabel = (label: string) => String(Number(+label / 1000000).toFixed(0));

  const renderTooltip = (item, index) => {
    return (
      <View
        style={{
          zIndex: 10000,
          backgroundColor: colors.background,
          paddingHorizontal: 6,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <RNText>{item.value}</RNText>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.barChartContainer,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <RNText style={styles.description} preset="subTitle">
        (Đơn vị: triệu)
      </RNText>
      <View style={styles.barChartTitle}>
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <RNText preset="subTitle">Thu</RNText>
        </View>
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: colors.error }]} />
          <RNText preset="subTitle">Chi</RNText>
        </View>
      </View>
      <View>
        <BarChart
          data={dataFormatted.flat()}
          isAnimated
          hideRules
          height={180}
          barWidth={20}
          barBorderRadius={4}
          noOfSections={4}
          maxValue={27000000}
          xAxisThickness={0}
          yAxisThickness={0}
          formatYLabel={formatYLabel}
          yAxisTextStyle={{ color: 'gray' }}
          showYAxisIndices
          // renderTooltip={renderTooltip}
        />
      </View>
    </View>
  );
}
export default BarChartComponent;
