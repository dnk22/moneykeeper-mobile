import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RNSegmentedControl, RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import {
  getCurrentBalanceAllAccount,
  queryAccountStatement,
  queryGetDebtLoanStatement,
} from 'database/querying';
import { formatNumber } from 'utils/math';
import { useAppDispatch, useAppSelector } from 'store/index';
import { setDataDetailLv1, setTotal, setViewType } from './reducer/financialStatement.slice';
import { selectTotal, selectViewType } from './reducer/financialStatement.selector';
import { convertDebtLoanData, convertFinancialData } from './helper';
import PieChart from './PieChart';
import CategoryDetail from './CategoryDetail';
import styles from './styles';

function FinanceStatement() {
  const { colors } = useCustomTheme();
  const dispatch = useAppDispatch();
  const isOwnedViewType = useAppSelector((state) => selectViewType(state));
  const total = useAppSelector((state) => selectTotal(state));

  useFocusEffect(
    useCallback(() => {
      getCurrentBalanceAllAccount().then((res) => {
        dispatch(setTotal(res));
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        queryAccountStatement(isOwnedViewType),
        queryGetDebtLoanStatement(isOwnedViewType),
      ]).then((res) => {
        const groupData = convertFinancialData(res[0], isOwnedViewType);
        const groupDebtLoan = convertDebtLoanData(res[1], isOwnedViewType);
        console.log(groupDebtLoan, 'groupDebtLoan');
        dispatch(setDataDetailLv1([...groupData, ...groupDebtLoan]));
      });
    }, [isOwnedViewType]),
  );

  const onChangeViewType = (index: any) => {
    dispatch(setViewType(!!!index));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.totalMoney, { backgroundColor: colors.surface }]}>
        <RNText style={styles.fontWeight300}>Tổng tài sản: </RNText>
        <RNText style={styles.totalAmount}>{formatNumber(total, true)}</RNText>
      </View>
      <RNSegmentedControl values={['Sở hữu', 'Dư nợ']} onChange={onChangeViewType} />
      <PieChart />
      <CategoryDetail />
    </View>
  );
}

export default FinanceStatement;
