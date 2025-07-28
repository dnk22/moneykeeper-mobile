import { useFocusEffect } from '@react-navigation/native';
import { accountLocalQuery } from 'database/querying';
import { TAccount } from 'database/types';
import { useCallback, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { useCustomTheme } from 'resources/theme';
import { showToast } from 'utils/system';

export default function useHook() {
  const { colors } = useCustomTheme();
  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [accountData, setAccountData] = useState<TAccount[]>([]);
  const pagerViewRef = useRef<PagerView>(null);

  const onActionPress = (account?: TAccount) => {
    currentAccountPressed.current = account;
    setShowModal(!isShowModal);
  };

  const onChangePageIndex = (index: number) => {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(index);
    }
  };

  const fetchAccounts = () => {
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
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, []),
  );

  return {
    isShowModal,
    fetchAccounts,
    currentAccountPressed,
    pagerViewRef,
    colors,
    pageIndex,
    accountData,
    onChangePageIndex,
    onActionPress,
    setPageIndex,
  };
}
