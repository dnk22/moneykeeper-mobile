import { View } from 'react-native';
import { useCallback, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetPaymentDueCreditCardByAccountId } from 'database/querying';
import { RNText } from 'components/index';
import { formatNumber } from 'utils/math';
import { TransactionHistoryContext } from '../context';
import styles from './styles';

function PaymentDue() {
  const {
    colors,
    accountId,
    currentStatement: statement,
    creditCardLimit,
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

  return (
    <>
      <View style={styles.bottom}>
        <View style={[styles.item, { alignItems: 'flex-start' }]}>
          <View style={styles.title}>
            <RNText fontSize={14}>Tổng nợ kỳ này</RNText>
          </View>
          <View>
            <RNText fontSize={16} color="#FF3232">
              {formatNumber(totalExpense, true)}
            </RNText>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <View style={[styles.item, { alignItems: 'flex-start', paddingLeft: 20 }]}>
          <View style={styles.title}>
            <RNText fontSize={14}>Dư nợ còn lại</RNText>
          </View>
          <View>
            <RNText fontSize={16} color="#45f248">
              {formatNumber(creditCardLimit - Math.abs(totalExpense), true)}
            </RNText>
          </View>
        </View>
      </View>
      <View style={[styles.dividerHorizontal, { backgroundColor: colors.divider }]} />
      <View>
        <View style={styles.title}>
          <RNText fontSize={14}>Hạn thanh toán </RNText>
          <RNText fontSize={10} color="gray">
            (dự kiến)
          </RNText>
        </View>
        <View>
          <RNText fontSize={16} color="#45f248"></RNText>
        </View>
      </View>
    </>
  );
}
export default PaymentDue;
