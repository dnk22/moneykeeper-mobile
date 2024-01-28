import React, { memo, useContext } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { RNText } from 'components/index';
import { formatNumber } from 'utils/math';
import { TransactionHistoryContext } from '../context';
import CurrentBalance from './CurrentBalance';
import PaymentDue from './PaymentDue';
import styles from './styles';

function Summary() {
  const { colors, currentStatement, creditCardLimit } = useContext(TransactionHistoryContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <RNText style={{ fontWeight: '500' }}>
        Hạn mức tín dụng: {formatNumber(creditCardLimit, true)}
      </RNText>
      {currentStatement.month ? <PaymentDue /> : <CurrentBalance />}
    </View>
  );
}
export default memo(Summary, isEqual);
