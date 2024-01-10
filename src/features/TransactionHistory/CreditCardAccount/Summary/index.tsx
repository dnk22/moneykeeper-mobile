import { memo, useCallback, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetSummaryCreditCardAccountById } from 'database/querying';
import { formatNumber } from 'utils/math';
import styles from './styles';

function Summary({ accountId, creditCardLimit }: { accountId: string; creditCardLimit: number }) {
  const { colors } = useCustomTheme();
  const [totalExpense, setTotalExpense] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      queryGetSummaryCreditCardAccountById({ accountId }).then((res) => {
        setTotalExpense(res);
      });
    }, [accountId]),
  );

  const currentExpenseBarWidth = useMemo(() => {
    const percent = (totalExpense / creditCardLimit) * 100;
    return percent < 100 ? percent : 100;
  }, [accountId, creditCardLimit, totalExpense]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <RNText style={{ fontWeight: '500' }}>
        Hạn mức tín dụng: {formatNumber(creditCardLimit, true)}
      </RNText>
      <View style={styles.bar}>
        <View style={[styles.expense, { width: `${Math.abs(currentExpenseBarWidth)}%` }]} />
        <View style={[styles.available, { flex: 1 }]} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.item}>
          <View style={styles.title}>
            <View style={[styles.boxIcon, { backgroundColor: '#FF3232' }]} />
            <RNText fontSize={14}>Đã chi tiêu</RNText>
          </View>
          <View>
            <RNText fontSize={16} color="#FF3232">
              {formatNumber(totalExpense, true)}
            </RNText>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <View style={styles.title}>
            <View style={[styles.boxIcon, { backgroundColor: '#45f248' }]} />
            <RNText fontSize={14}>Khả dụng</RNText>
          </View>
          <View>
            <RNText fontSize={16} color="#45f248">
              {formatNumber(creditCardLimit - Math.abs(totalExpense), true)}
            </RNText>
          </View>
        </View>
      </View>
    </View>
  );
}
export default memo(Summary, isEqual);
