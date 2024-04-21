import { useCallback, useState } from 'react';
import Empty from 'components/Empty';
import { useFocusEffect } from '@react-navigation/native';
import { queryGetDebtLoanList } from 'database/querying';
import { DebtLoanTypes } from 'utils/types';
import PieChart from './PieChart';
import DebtLoanList from './DebtLoanList';
import DebtLoanStatement from './DebtLoanStatement';

function DebtLoanSummary({ isDebt = false }: { isDebt?: boolean }) {
  const [debtLoanData, setDebtLoanData] = useState<DebtLoanTypes[]>([]);

  useFocusEffect(
    useCallback(() => {
      queryGetDebtLoanList({ isDebt }).then((res) => {
        setDebtLoanData(res);
      });
    }, [isDebt]),
  );

  return (
    <>
      {!!debtLoanData.length ? (
        <>
          <PieChart data={debtLoanData} isDebt={isDebt} />
          <DebtLoanStatement isDebt={isDebt} />
          <DebtLoanList data={debtLoanData} />
        </>
      ) : (
        <Empty />
      )}
    </>
  );
}
export default DebtLoanSummary;
