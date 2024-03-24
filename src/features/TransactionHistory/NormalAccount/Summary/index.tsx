import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { RNText, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetSummaryAccountById } from 'database/querying';
import { formatNumber } from 'utils/math';
import { useAppSelector } from 'store/index';
import { selectRefreshTransactionHistory } from 'store/transactions/transactions.selector';
import styles from './styles';

function Summary({ accountId }: { accountId: string }) {
  const { colors } = useCustomTheme();
  const refreshTransactionHistory = useAppSelector((state) =>
    selectRefreshTransactionHistory(state),
  );
  const [summary, setSummary] = useState<Record<string, number>>({
    totalIncome: 0,
    totalExpense: 0,
  });

  useFocusEffect(
    useCallback(() => {
      queryGetSummaryAccountById({ accountId }).then((res) => {
        setSummary(res);
      });
    }, [accountId, refreshTransactionHistory]),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.item}>
        <View style={styles.title}>
          <SvgIcon name="arrowCircleUp" color="green" size={14} />
          <RNText fontSize={14}>Tổng Thu</RNText>
        </View>
        <View>
          <RNText fontSize={16} color="green">
            {formatNumber(summary.totalIncome, true)}
          </RNText>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <View style={styles.title}>
          <SvgIcon name="arrowCircleDown" color="red" size={14} />
          <RNText fontSize={14}>Tổng Chi</RNText>
        </View>
        <View>
          <RNText fontSize={16} color="red">
            {formatNumber(summary.totalExpense, true)}
          </RNText>
        </View>
      </View>
    </View>
  );
}
export default Summary;
