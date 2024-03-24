import React, { memo, useCallback, useMemo } from 'react';
import { SectionListData, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { Empty, PressableHaptic, RNText, SectionListComponent, SvgIcon } from 'components/index';
import { TAccount } from 'database/types';
import { debounce } from 'lodash';
import { useCustomTheme } from 'resources/theme';
import { groupAccountDataByValue, sortDataByKey } from 'utils/algorithm';
import { ADD_ACCOUNT } from 'navigation/constants';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { updateAccountViewSettings } from 'store/app/app.slice';
import AccountItem from './AccountItem';
import styles from './styles';

type AccountListProps = {
  title?: string;
  isDeactivate?: boolean;
  onActionPress?: (account: TAccount) => void;
  account?: TAccount[];
  onRefresh: () => void;
};

function AccountList({ onActionPress, account = [], onRefresh }: AccountListProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {
    group: isGroup,
    sort,
    isViewActive,
  } = useAppSelector((state) => selectAccountViewSettings(state));

  const getInactiveAccount = useMemo(() => {
    const inActiveAccount = account.filter((item) => !item.isActive) || [];
    return [{ data: inActiveAccount }];
  }, [account]);

  const getActiveAccount = useMemo(() => {
    const activeAccount = account.filter((item) => item.isActive);
    return isGroup
      ? groupAccountDataByValue(activeAccount, sort)
      : [{ data: activeAccount.sort(sortDataByKey(sort)) }];
  }, [account, isGroup, sort]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<TAccount> }) => {
      if (!isGroup) return null;
      const { title } = section;
      return (
        <RNText color="#747471" fontSize={13}>
          {title}
        </RNText>
      );
    },
    [isGroup],
  );

  const renderItem = ({ item }: { item: TAccount }) => {
    return <AccountItem account={item} onActionPress={onActionPress} />;
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <RNText style={styles.title}>{isViewActive ? 'Đang sử dụng' : 'Ngừng sử dụng'}</RNText>
        <PressableHaptic
          onPress={debounce(
            () => dispatch(updateAccountViewSettings({ isViewActive: !isViewActive })),
            200,
          )}
          style={styles.iconSwapContainer}
        >
          <SvgIcon name="swap" />
        </PressableHaptic>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <SectionListComponent
        sections={isViewActive ? getActiveAccount : getInactiveAccount}
        initialNumToRender={8}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
        onRefresh={onRefresh}
        hasPull
      />
      {isViewActive && (
        <PressableHaptic
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate(ADD_ACCOUNT)}
        >
          <SvgIcon name="add" size={30} color="white" />
        </PressableHaptic>
      )}
    </View>
  );
}

export default memo(AccountList, isEqual);
