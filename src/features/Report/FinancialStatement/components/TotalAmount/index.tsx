import { useCallback, useState } from 'react';
import { View } from 'react-native';
import RNText from 'components/Text';
import { formatNumber } from 'utils/math';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect } from '@react-navigation/native';
import { reportLocalQuery } from 'database/querying/report';
import styles from '../../styles';

function TotalAmount() {
  const { colors } = useCustomTheme();
  const [currentBalance, setCurrentBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      reportLocalQuery.getCurrentBalanceAllAccount().then((res) => {
        setCurrentBalance(res);
      });
    }, []),
  );

  return (
    <View style={[styles.totalMoney, { backgroundColor: colors.surface }]}>
      <RNText fontSize={14} style={styles.fontWeight300}>
        Tổng tài sản:{' '}
      </RNText>
      <RNText fontSize={20} style={styles.totalAmount}>
        {formatNumber(currentBalance, true)}
      </RNText>
    </View>
  );
}
export default TotalAmount;
