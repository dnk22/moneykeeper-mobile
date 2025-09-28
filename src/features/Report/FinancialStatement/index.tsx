import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RNSegmentedControl from 'components/SegmentedControl';
import { useCustomTheme } from 'resources/theme';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectRefreshData, selectViewType } from './reducer/financialStatement.selector';
import { setDataDetailLv1, setViewType } from './reducer/financialStatement.slice';
import { reportLocalQuery } from 'database/querying/report';
import { convertDebtLoanData, convertFinancialData } from './helper';
import PieChart from './components/PieChart';
import CategoryDetail from './components/CategoryDetail';
import TotalAmount from './components/TotalAmount';
import styles from './styles';

function FinanceStatement() {
  const { colors } = useCustomTheme();
  const dispatch = useAppDispatch();
  const isOwnedViewType = useAppSelector((state) => selectViewType(state));
  const isRefreshData = useAppSelector((state) => selectRefreshData(state));

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        reportLocalQuery.queryAccountStatement({ isDebt: isOwnedViewType }),
        reportLocalQuery.queryGetDebtLoanList({ isDebt: isOwnedViewType }),
      ]).then((res) => {
        const groupData = convertFinancialData(res[0], isOwnedViewType);
        const groupDebtLoan = convertDebtLoanData(res[1], isOwnedViewType);
        dispatch(setDataDetailLv1([...groupData, ...groupDebtLoan]));
      });
    }, [isOwnedViewType, isRefreshData]),
  );

  const onChangeViewType = (index: any) => {
    dispatch(setViewType(!!!index));
  };

  return (
    <View style={styles.container}>
      <TotalAmount />
      <RNSegmentedControl
        values={['Sở hữu', 'Dư nợ']}
        onChange={onChangeViewType}
        tintColor={colors.background}
      />
      {/* <PieChart /> */}
      <CategoryDetail />
    </View>
  );
}

export default FinanceStatement;
