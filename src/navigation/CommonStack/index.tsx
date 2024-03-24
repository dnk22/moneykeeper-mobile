import {
  ADD_ACCOUNT,
  ACCOUNT_NORMAL_DETAIL,
  CREATE_TRANSACTION_FROM_ACCOUNT,
  ACCOUNT_CREDIT_CARD_DETAIL,
  EXPENSE_INCOME_DETAIL,
  FINANCE_STATEMENT,
} from 'navigation/constants';
import AddAccount from 'features/AddAccount';
import TransactionHistoryNormal from 'features/TransactionHistory/NormalAccount';
import TransactionHistoryCreditCard from 'features/TransactionHistory/CreditCardAccount';
import AddTransactions from 'features/Transaction/AddTransaction';
import ExpenseIncomeDetail from 'features/Report/ExpenseIncomeDetail';
import FinancialStatement from 'features/Report/FinancialStatement';

function CommonStack({ Stack }: { Stack: any }) {
  return (
    <>
      <Stack.Screen
        name={ADD_ACCOUNT}
        options={({ route }) => ({
          title: route.params?.accountId ? 'Sửa tài khoản' : 'Thêm tài khoản',
        })}
        component={AddAccount}
      />
      <Stack.Screen
        name={ACCOUNT_NORMAL_DETAIL}
        options={({ route }) => ({
          title: route.params?.accountName,
        })}
        component={TransactionHistoryNormal}
      />
      <Stack.Screen
        name={ACCOUNT_CREDIT_CARD_DETAIL}
        options={({ route }) => ({
          title: route.params?.accountName,
        })}
        component={TransactionHistoryCreditCard}
      />
      <Stack.Screen name={CREATE_TRANSACTION_FROM_ACCOUNT} component={AddTransactions} />

      <Stack.Screen
        name={EXPENSE_INCOME_DETAIL}
        component={ExpenseIncomeDetail}
        options={({ route: { params } }) => ({
          title: `Chi tiêu ${params.dateView.toLowerCase()}`,
        })}
      />
      <Stack.Screen
        name={FINANCE_STATEMENT}
        component={FinancialStatement}
        options={{
          title: 'Tổng quan tài sản',
        }}
      />
    </>
  );
}

export default CommonStack;
