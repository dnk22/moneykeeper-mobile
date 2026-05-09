import { memo, useMemo } from 'react';
import Empty from 'components/Empty';
import RNText from 'components/Text';
import FlatListComponent from 'components/FlatList';
import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { groupAccountDataByKey, sortDataByKey } from 'utils/algorithm';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import { MAP_SUBTITLE } from 'features/account/AccountDashboard/constants';
import isEqual from 'react-fast-compare';
import AccountItem from './Item';
import styles from './styles';

function AccountList({
  data,
  onRefresh,
  index,
}: {
  data: TAccount[];
  onRefresh: () => void;
  index: number;
}) {
  const { colors } = useCustomTheme();
  const { groupByType, sortByName } = useAppSelector((state) => selectAccountViewSettings(state));
  const sortField = useMemo(() => (sortByName ? 'accountName' : 'sortOrder'), [sortByName]);

  const accountData = useMemo(() => {
    const accountList = data.filter((item) => +item.isActive === 1);
    return groupByType && !index
      ? groupAccountDataByKey(accountList, sortField)
      : [...accountList].sort(sortDataByKey(sortField));
  }, [data, groupByType, sortField]);

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
      data={accountData}
      renderItem={renderItem}
      ListEmptyComponent={
        <Empty
          styles={styles.emptyText}
          title="Bạn chưa có tài khoản nào"
          subTitle={MAP_SUBTITLE['1']}
        />
      }
      maintainVisibleContentPosition={{ disabled: true }}
      onRefresh={onRefresh}
      getItemType={(item) => {
        return item.title ? 'sectionHeader' : 'row';
      }}
      contentContainerStyle={{
        paddingBottom: 180,
        paddingRight: 12,
      }}
    />
  );
}

export default memo(AccountList, isEqual);
