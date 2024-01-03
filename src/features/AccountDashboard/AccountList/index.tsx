import React, { memo, useCallback, useMemo, useState } from 'react';
import { Image, SectionListData, View } from 'react-native';
import isEqual from 'react-fast-compare';
import {
  Empty,
  IconComponent,
  PressableHaptic,
  RNText,
  SectionListComponent,
  SvgIcon,
} from 'components/index';
import { TAccount } from 'database/types';
import { debounce } from 'lodash';
import { useCustomTheme } from 'resources/theme';
import { groupDataByValue } from 'utils/algorithm';
import { ADD_ACCOUNT } from 'navigation/constants';
import { useNavigation } from '@react-navigation/native';
import Item from './Item';
import styles from './styles';

type AccountListProps = {
  title?: string;
  isDeactivate?: boolean;
  isGroup?: boolean;
  onActionPress?: (account: TAccount) => void;
  account?: any;
};

function AccountList({ isGroup = false, onActionPress, account = [] }: AccountListProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const [viewActive, setViewActive] = useState(true);

  const getInactiveAccount = useMemo(() => {
    const inActiveAccount = account.filter((item) => !item.isActive);
    return inActiveAccount.length ? [{ data: inActiveAccount }] : [];
  }, [account]);

  const getActiveAccount = useMemo(() => {
    const activeAccount = account.filter((item) => item.isActive);
    return isGroup ? groupDataByValue(activeAccount) : activeAccount;
  }, [account, isGroup]);

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
    return <Item account={item} onActionPress={onActionPress} />;
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <RNText style={styles.title}>{viewActive ? 'Đang sử dụng' : 'Ngừng sử dụng'}</RNText>
        <PressableHaptic
          onPress={debounce(() => setViewActive(!viewActive), 200)}
          style={styles.iconSwapContainer}
        >
          <IconComponent name="swap" size={20} useTheme style={styles.iconSwap} />
        </PressableHaptic>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <SectionListComponent
        sections={viewActive ? getActiveAccount : getInactiveAccount}
        initialNumToRender={8}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
      />
      {viewActive && (
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
