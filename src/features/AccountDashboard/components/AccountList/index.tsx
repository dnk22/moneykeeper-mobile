import { memo, useMemo } from 'react';
import { SectionListData } from 'react-native';
import SectionListComponent from 'components/SectionList';
import Empty from 'components/Empty';
import RNText from 'components/Text';
import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { groupAccountDataByValue, sortDataByKey } from 'utils/algorithm';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import AccountItem from './Item';
import { MAP_SUBTITLE } from 'features/AccountDashboard/constants';
import isEqual from 'react-fast-compare';
import { accountListStyles as styles } from '../../styles';

function ActiveAccount({
  isActive = true,
  data,
  onRefresh,
}: {
  isActive?: boolean;
  data: TAccount[];
  onRefresh: () => void;
}) {
  const { colors } = useCustomTheme();
  const { groupByType, sortByName } = useAppSelector((state) => selectAccountViewSettings(state));
  const sortField = useMemo(() => (sortByName ? 'accountName' : 'sortOrder'), [sortByName]);

  const accountList = useMemo(() => {
    const accountList = data.filter((item) => item.isActive === +isActive);
    return groupByType
      ? groupAccountDataByValue(accountList, sortField)
      : [{ data: accountList.sort(sortDataByKey(sortField)) }];
  }, [data, groupByType, sortField, isActive]);

  const renderSectionHeader = ({ section }: { section: SectionListData<TAccount> }) => {
    if (!groupByType) {
      return null;
    }
    const { title } = section;
    return (
      <RNText color={colors.textSecondary} fontSize={13}>
        {title}
      </RNText>
    );
  };

  const renderItem = ({ item }: { item: TAccount }) => {
    return <AccountItem account={item} />;
  };

  return (
    <SectionListComponent
      sections={accountList}
      initialNumToRender={10}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListEmptyComponent={
        <Empty
          styles={styles.emptyText}
          title="Bạn chưa có tài khoản nào"
          subTitle={MAP_SUBTITLE[isActive ? '1' : '0']}
        />
      }
      onRefresh={onRefresh}
      hasPull
    />
  );
}

export default memo(ActiveAccount, isEqual);
