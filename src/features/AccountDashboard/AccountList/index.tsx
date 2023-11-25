import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { Empty, RNText, SectionListComponent } from 'components/index';
import { TAccount } from 'database/types/index';
import { SCREEN_HEIGHT } from 'share/dimensions';
import Collapsible from 'react-native-collapsible';
import { useCustomTheme } from 'resources/theme';
import Header from './Header';
import Item from './Item';
import styles from './styles';

type AccountListProps = {
  title?: string;
  isDeactivate?: boolean;
  isGroup?: boolean;
  onActionPress?: (account: TAccount) => void;
  account?: any;
};

const maxHeight = SCREEN_HEIGHT * 0.55;

function AccountList({ title, isGroup = false, onActionPress, account = [] }: AccountListProps) {
  const { colors } = useCustomTheme();
  const renderKey = useRef(0);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    // change key to force-render collapse view
    renderKey.current = renderKey.current + 1;
    if (!Boolean(account.length) !== collapse) {
      setCollapse(!Boolean(account.length));
    }
  }, [account]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<TAccount> }) => {
      if (!isGroup) return null;
      const { title } = section;
      return <RNText color="#747471">{`${title}`}</RNText>;
    },
    [isGroup],
  );

  const renderItem = ({ item }: { item: TAccount }) => {
    return <Item account={item} onActionPress={onActionPress} />;
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <Header onPress={() => setCollapse(!collapse)} title={title} isActive={collapse} />
      <Collapsible collapsed={collapse} key={renderKey.current}>
        <SectionListComponent
          style={{ maxHeight }}
          sections={account}
          initialNumToRender={8}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
        />
      </Collapsible>
    </View>
  );
}

export default AccountList;
