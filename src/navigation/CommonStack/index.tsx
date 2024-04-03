import React from 'react';
import {
  ADD_ACCOUNT,
  ACCOUNT_NORMAL_DETAIL,
  CREATE_TRANSACTION_FROM_ACCOUNT,
  ACCOUNT_CREDIT_CARD_DETAIL,
  EXPENSE_INCOME_DETAIL,
  FINANCE_STATEMENT,
  EXPENSE_INCOME_REPORT,
  DEBT_LOAN_REPORT,
} from 'navigation/constants';
import AddAccount from 'features/AddAccount';
import TransactionHistoryNormal from 'features/TransactionHistory/NormalAccount';
import TransactionHistoryCreditCard from 'features/TransactionHistory/CreditCardAccount';
import AddTransactions from 'features/Transaction/AddTransaction';
import ExpenseIncome from 'features/Report/ExpenseIncome';
import FinancialStatement from 'features/Report/FinancialStatement';
import ExpenseIncomeReport from 'features/Report/ExpenseIncome';
import DebtLoanReport from 'features/Report/DebtLoan';

function CommonStack({ Stack, parentName }: { Stack: any; parentName?: string }): any {
  return (
    <React.Fragment key={parentName}>
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
      <Stack.Screen
        key={CREATE_TRANSACTION_FROM_ACCOUNT}
        name={CREATE_TRANSACTION_FROM_ACCOUNT}
        options={() => ({
          title: '',
        })}
        component={AddTransactions}
      />
      <Stack.Screen
        name={EXPENSE_INCOME_DETAIL}
        component={ExpenseIncome}
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
      <Stack.Screen
        name={EXPENSE_INCOME_REPORT}
        component={ExpenseIncomeReport}
        options={{
          title: 'Thu & Chi',
        }}
      />
      <Stack.Screen
        name={DEBT_LOAN_REPORT}
        component={DebtLoanReport}
        options={{
          title: 'Theo dõi Vay Nợ',
        }}
      />
    </React.Fragment>
  );
}

export default CommonStack;
