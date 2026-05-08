import { useFocusEffect } from '@react-navigation/native';
import { accountLocalQuery } from 'database/querying';
import { TAccount } from 'database/types';
import { useCallback, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { showToast } from 'utils/system';

export default function useAccountDashboard() {
  const currentAccountPressed = useRef<TAccount | null>(null);
  const [isShowModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [accountData, setAccountData] = useState<TAccount[]>([]);
  const pagerViewRef = useRef<PagerView>(null);

  const openActionModal = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    setShowModal(true);
  }, []);

  const closeActionModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onChangePageIndex = useCallback((index: number) => {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(index);
    }
  }, []);

  const fetchAccounts = useCallback(
    (redirect?: boolean) => {
      accountLocalQuery
        .getAccounts()
        .then((data) => {
          setAccountData(data);
          // If redirect is true, all account active => go to first page
          // If any account is inactive, do not redirect
          if (redirect) {
            const isSomeAccountInactive = data.some((account) => !account.isActive);
            if (isSomeAccountInactive) {
              return;
            }
            onChangePageIndex(0);
          }
        })
        .catch(() => {
          showToast({
            type: 'error',
            text2: 'Không thể tải danh sách tài khoản',
          });
        });
    },
    [onChangePageIndex],
  );

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [fetchAccounts]),
  );

  return {
    isShowModal,
    fetchAccounts,
    currentAccountPressed,
    pagerViewRef,
    pageIndex,
    accountData,
    onChangePageIndex,
    openActionModal,
    closeActionModal,
    setPageIndex,
  };
}
