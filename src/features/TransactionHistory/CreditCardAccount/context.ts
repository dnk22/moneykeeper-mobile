import { createContext } from 'react';
import { StatementViewProps } from 'utils/types';

export const TransactionHistoryContext = createContext<{
  colors: any;
  currentStatement: StatementViewProps;
  statementInfo: Record<string, number>;
  creditCardLimit: number;
  accountId: string;
  refreshData: number;
  onRefreshData: () => void;
}>({});
