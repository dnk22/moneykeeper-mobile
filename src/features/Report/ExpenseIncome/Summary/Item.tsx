import { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';

import { formatNumber } from 'utils/math';
import { formatDateLocal } from 'utils/date';
import { VIEW_EXPENSE_INCOME_REPORT_BY } from 'utils/constants';
import styles from '../styles';

function Item({
  data,
  type,
}: {
  data: { date: Date; totalIncome: number; totalExpense: number };
  type: VIEW_EXPENSE_INCOME_REPORT_BY;
}) {
  const { colors } = useCustomTheme();

  const formatDateByType =
    type === VIEW_EXPENSE_INCOME_REPORT_BY.MONTH
      ? 'MMMM'
      : type === VIEW_EXPENSE_INCOME_REPORT_BY.QUARTER
      ? 'qqqq'
      : 'yyyy';

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText preset="widgetTitle" color={colors.primary} style={styles.dateTitle}>
        {formatDateLocal(data.date, formatDateByType)}
      </RNText>
      <View style={styles.itemDetail}>
        <View style={styles.col}>
          <RNText style={styles.itemTitle} fontSize={14}>
            Thu
          </RNText>
          <RNText color={colors.success}>{formatNumber(data.totalIncome, true)}</RNText>
        </View>
        <View style={styles.col}>
          <RNText style={styles.itemTitle} fontSize={14}>
            Chi
          </RNText>
          <RNText color={colors.error}>{formatNumber(data.totalExpense, true)}</RNText>
        </View>
        <View style={styles.col}>
          <RNText style={styles.itemTitle} fontSize={14}>
            Dư
          </RNText>
          <RNText>{formatNumber(data.totalIncome - data.totalExpense || 0, true)}</RNText>
        </View>
      </View>
    </View>
  );
}

export default memo(Item, isEqual);
