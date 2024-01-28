import { View } from 'react-native';
import { useCallback, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetPaymentDueCreditCardByAccountId } from 'database/querying';
import { RNText } from 'components/index';
import { formatNumber } from 'utils/math';
import { TransactionHistoryContext } from '../context';
import { addDays } from 'date-fns';
import { formatDateLocal } from 'utils/date';
import styles from './styles';

function PaymentDue() {
  const {
    colors,
    accountId,
    currentStatement: statement,
    creditCardLimit,
    statementInfo,
  } = useContext(TransactionHistoryContext);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      queryGetPaymentDueCreditCardByAccountId({
        accountId,
        startDate: statement.startDate,
        endDate: statement.endDate,
      }).then((res) => {
        setTotalExpense(res);
      });
    }, [accountId, statement]),
  );

  const paymentDate = () => {
    const date = addDays(new Date(statement.endDate), statementInfo.paymentDate);
    return formatDateLocal(date, 'dd/MM/yyyy - 17:00');
  };

  return (
    <View style={styles.bottom}>
      <View style={[styles.item, { alignItems: 'flex-start' }]}>
        <View style={styles.title}>
          <RNText fontSize={14}>Tổng nợ kỳ này</RNText>
        </View>
        <View>
          <RNText color="#FF3232">{formatNumber(totalExpense, true)}</RNText>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={[styles.item, { alignItems: 'flex-start', paddingLeft: 15 }]}>
        <View style={styles.title}>
          <RNText fontSize={14}>Hạn thanh toán</RNText>
          <RNText fontSize={10} color="gray">
            (dự kiến)
          </RNText>
        </View>
        <View>
          <RNText>{paymentDate()}</RNText>
        </View>
      </View>
    </View>
  );
}
export default PaymentDue;
