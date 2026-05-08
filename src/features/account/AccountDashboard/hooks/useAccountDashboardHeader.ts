import { useCallback, useMemo } from 'react';
import { TAccount } from 'database/types';

type UseAccountDashboardHeaderParams = {
  accountData: TAccount[];
  setPageIndex: (index: number) => void;
  onChangePageIndex: (index: number) => void;
};

export default function useAccountDashboardHeader({
  accountData,
  setPageIndex,
  onChangePageIndex,
}: UseAccountDashboardHeaderParams) {
  const totalAsset = useMemo(
    () =>
      accountData.reduce((total, account) => {
        const accountAmount = Number(account.closingAmount ?? account.initialAmount ?? 0);
        return Number.isNaN(accountAmount) ? total : total + accountAmount;
      }, 0),
    [accountData],
  );

  const onTabChange = useCallback(
    (index: number) => {
      setPageIndex(index);
      onChangePageIndex(index);
    },
    [onChangePageIndex, setPageIndex],
  );

  const onPageSelected = useCallback(
    (index: number) => {
      setPageIndex(index);
    },
    [setPageIndex],
  );

  return {
    totalAsset,
    onTabChange,
    onPageSelected,
  };
}
