import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { RNText, ProgressLineChart } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetDebtLoanStatementSummary } from 'database/querying';
import { formatNumber } from 'utils/math';
import styles from './styles';

function DebtLoanStatement({ isDebt }: { isDebt: boolean }) {
  const { colors } = useCustomTheme();
  const [debtLoanStatement, setDebtLoanStatement] = useState({
    total: 0,
    collected: 0,
  });

  const progressData = [
    {
      value: debtLoanStatement.collected,
      color: 'green',
    },
    {
      value: debtLoanStatement.total - debtLoanStatement.collected,
      color: colors.divider,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      queryGetDebtLoanStatementSummary({ isDebt }).then((res) => {
        if (res && res.length) {
          setDebtLoanStatement({
            total: Math.abs(res[0].total),
            collected: Math.abs(res[0].collected),
          });
        }
      });
    }, []),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={{ flexDirection: 'row' }}>
        <RNText style={styles.title}>{isDebt ? 'Tổng cho vay: ' : 'Tổng đi vay: '}</RNText>
        <RNText style={styles.value}>{formatNumber(debtLoanStatement.total, true)}</RNText>
      </View>
      <View style={[styles.row, styles.progressLine]}>
        <ProgressLineChart data={progressData} />
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <RNText style={styles.title}>{isDebt ? 'Đã thu' : 'Đã trả'}</RNText>
          <RNText style={styles.value} color="green">
            {formatNumber(debtLoanStatement.collected, true)}
          </RNText>
        </View>
        <View style={styles.col}>
          <RNText style={styles.title}>{isDebt ? 'Phải thu' : 'Còn nợ'}</RNText>
          <RNText style={styles.value} color="red">
            {formatNumber(debtLoanStatement.total - debtLoanStatement.collected, true)}
          </RNText>
        </View>
      </View>
    </View>
  );
}
export default DebtLoanStatement;
