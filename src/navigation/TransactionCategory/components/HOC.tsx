import CategoryTab from 'features/TransactionCategory/CategoryTab';
import { EXPENSE_CATEGORY, INCOME_CATEGORY } from 'navigation/constants';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

function HOCTransactionCategory({ route }) {
  const type =
    route.name === EXPENSE_CATEGORY
      ? TRANSACTION_CATEGORY_TYPE.EXPENSE
      : route.name === INCOME_CATEGORY
      ? TRANSACTION_CATEGORY_TYPE.INCOME
      : TRANSACTION_CATEGORY_TYPE.LEND_BORROW;

  return <CategoryTab type={type} />;
}
export default HOCTransactionCategory;
