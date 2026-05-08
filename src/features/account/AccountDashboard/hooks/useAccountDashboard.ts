import { useFocusEffect } from '@react-navigation/native';
import { accountLocalQuery } from 'database/querying';
import { TAccount } from 'database/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { showToast } from 'utils/system';

export default function useAccountDashboard() {
  const currentAccountPressed = useRef<TAccount | null>(null);
  const [isShowModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [accountData, setAccountData] = useState<TAccount[]>([]);
  const pagerViewRef = useRef<PagerView>(null);

  const totalAsset = useMemo(
    () =>
      accountData.reduce((total, account) => {
        const accountAmount = Number(account.closingAmount ?? account.initialAmount ?? 0);
        return Number.isNaN(accountAmount) ? total : total + accountAmount;
      }, 0),
    [accountData],
  );

  const openActionModal = (account: TAccount) => {
    currentAccountPressed.current = account;
    setShowModal(true);
  };

  const closeActionModal = () => {
    setShowModal(false);
  };

  const onTabChange = (index: number) => {
    setPageIndex(index);
    pagerViewRef?.current?.setPage(index);
  };

  const onPageSelected = (index: number) => {
    setPageIndex(index);
  };

  const fetchAccounts = useCallback(() => {
    accountLocalQuery
      .getAccounts()
      .then((data) => {
        setAccountData(data);
      })
      .catch(() => {
        showToast({
          type: 'error',
          text2: 'Không thể tải danh sách tài khoản',
        });
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [fetchAccounts]),
  );

  return {
    totalAsset,
    isShowModal,
    currentAccountPressed,
    pagerViewRef,
    pageIndex,
    accountData,
    openActionModal,
    closeActionModal,
    setPageIndex,
    fetchAccounts,
    onTabChange,
    onPageSelected,
  };
}
