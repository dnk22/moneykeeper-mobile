import ExpenseIncome from 'features/TransactionCategory/ExpenseIncome';
import { EXPENSE_CATEGORY } from 'navigation/constants';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

function HOCTransactionCategory({ route }) {
  const type =
    route.name === EXPENSE_CATEGORY
      ? TRANSACTION_CATEGORY_TYPE.EXPENSE
      : TRANSACTION_CATEGORY_TYPE.INCOME;

  return <ExpenseIncome type={type} />;
}
export default HOCTransactionCategory;
