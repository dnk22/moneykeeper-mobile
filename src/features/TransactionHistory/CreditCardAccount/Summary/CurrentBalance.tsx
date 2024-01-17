import { View } from 'react-native';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetCurrentBalanceCreditCardByAccountId } from 'database/querying';
import { RNText } from 'components/index';
import { formatNumber } from 'utils/math';
import { TransactionHistoryContext } from '../context';
import styles from './styles';
import { STATEMENT_TYPE } from 'utils/types';

function CurrentBalance() {
  const {
    colors,
    accountId,
    currentStatement: statement,
    creditCardLimit,
    refreshData,
  } = useContext(TransactionHistoryContext);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const showTotalExpense = totalExpense < 0 ? totalExpense : 0;

  useFocusEffect(
    useCallback(() => {
      queryGetCurrentBalanceCreditCardByAccountId({
        accountId,
        endDate: statement.endDate,
        getAll: statement.type === STATEMENT_TYPE.ALL,
      }).then((res) => {
        setTotalExpense(res);
      });
    }, [accountId, statement, refreshData]),
  );

  const currentExpenseBarWidth = useMemo(() => {
    const percent = (showTotalExpense / creditCardLimit) * 100;
    return percent < 100 ? percent : 100;
  }, [accountId, creditCardLimit, showTotalExpense]);

  return (
    <>
      <View style={styles.bar}>
        <View style={[styles.expense, { width: `${Math.abs(currentExpenseBarWidth)}%` }]} />
        <View style={[styles.available, { flex: 1 }]} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.item}>
          <View style={styles.title}>
            <View style={[styles.boxIcon, { backgroundColor: '#FF3232' }]} />
            <RNText fontSize={14}>Dư nợ hiện tại</RNText>
          </View>
          <View>
            <RNText fontSize={16} color="#FF3232">
              {formatNumber(showTotalExpense, true)}
            </RNText>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <View style={styles.item}>
          <View style={styles.title}>
            <View style={[styles.boxIcon, { backgroundColor: '#45f248' }]} />
            <RNText fontSize={14}>Khả dụng</RNText>
          </View>
          <View>
            <RNText fontSize={16} color="#45f248">
              {formatNumber(creditCardLimit + totalExpense, true)}
            </RNText>
          </View>
        </View>
      </View>
    </>
  );
}
export default CurrentBalance;
