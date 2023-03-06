import { RNText, SectionListComponent } from 'components/index';
import { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { SectionListData, View } from 'react-native';
import { TAccount } from 'database/types/index';
import Item from './Item';
import styles from './styles';

interface AccountListProps {
  data: SectionListData<TAccount, any>;
  isGroup?: boolean;
  isItemSelected?: string;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
}

function AccountList({
  data,
  onActionPress,
  isGroup = true,
  isItemSelected,
  onItemPress,
}: AccountListProps) {
  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<TAccount> }) => {
      if (!isGroup) return null;
      const { title } = section;
      return (
        <View style={styles.groupTitle}>
          <RNText>{`${title}`}</RNText>
        </View>
      );
    },
    [isGroup],
  );

  const renderItem = ({ item }: { item: TAccount }) => {
    return (
      <Item
        account={item}
        onActionPress={onActionPress}
        onItemPress={onItemPress}
        isItemSelected={isItemSelected}
      />
    );
  };

  return (
    <SectionListComponent
      sections={data}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
}
export default memo(AccountList, isEqual);
