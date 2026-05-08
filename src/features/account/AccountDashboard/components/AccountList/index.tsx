import { memo, useMemo } from 'react';
import Empty from 'components/Empty';
import RNText from 'components/Text';
import FlatListComponent from 'components/FlatList';
import { TAccount } from 'database/types';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { groupAccountDataByKey, sortDataByKey } from 'utils/algorithm';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import { MAP_SUBTITLE } from 'features/account/AccountDashboard/constants';
import isEqual from 'react-fast-compare';
import AccountItem from './Item';
import styles from './styles';

function AccountList({
  isActive = true,
  data,
  onRefresh,
  onScrollOffsetChange,
}: {
  isActive?: boolean;
  data: TAccount[];
  onRefresh: () => void;
  onScrollOffsetChange?: (offsetY: number) => void;
}) {
  const { colors } = useCustomTheme();
  const { groupByType, sortByName } = useAppSelector((state) => selectAccountViewSettings(state));
  const sortField = useMemo(() => (sortByName ? 'accountName' : 'sortOrder'), [sortByName]);

  const accountData = useMemo(() => {
    const accountList = data.filter((item) => +item.isActive === +isActive);
    return groupByType
      ? groupAccountDataByKey(accountList, sortField)
      : [...accountList].sort(sortDataByKey(sortField));
  }, [data, groupByType, sortField, isActive]);

  const renderItem = ({ item }: { item: TAccount & { title: string; accountTypeId: number } }) => {
    if (item.title) {
      return (
        <RNText color={colors.textSecondary} fontSize={13}>
          {item.title}
        </RNText>
      );
    }

    return <AccountItem account={item} />;
  };

  return (
    <FlatListComponent
      gap={10}
      data={accountData}
      renderItem={renderItem}
      ListEmptyComponent={
        <Empty
          styles={styles.emptyText}
          title="Bạn chưa có tài khoản nào"
          subTitle={MAP_SUBTITLE[isActive ? '1' : '0']}
        />
      }
      maintainVisibleContentPosition={{ disabled: true }}
      onRefresh={onRefresh}
      scrollEventThrottle={16}
      onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScrollOffsetChange?.(event.nativeEvent.contentOffset.y);
      }}
      getItemType={(item) => {
        return item.title ? 'sectionHeader' : 'row';
      }}
    />
  );
}

export default memo(AccountList, isEqual);
