import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, SectionListData, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { Empty, PressableHaptic, RNText, SectionListComponent, SvgIcon } from 'components/index';
import { TAccount } from 'database/types/index';
import { SCREEN_HEIGHT } from 'share/dimensions';
import Collapsible from 'react-native-collapsible';
import { useCustomTheme } from 'resources/theme';
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
  const rotateAnim = useRef(new Animated.Value(1)).current;
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  useEffect(() => {
    // change key to force-render collapse view
    renderKey.current = renderKey.current + 1;
    if (!Boolean(account.length) !== collapse) {
      setCollapse(!Boolean(account.length));
    }
  }, [account]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: collapse ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [collapse]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<TAccount> }) => {
      if (!isGroup) return null;
      const { title } = section;
      return <RNText color="#747471" fontSize={13}>{title}</RNText>;
    },
    [isGroup],
  );

  const renderItem = ({ item }: { item: TAccount }) => {
    return <Item account={item} onActionPress={onActionPress} />;
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <PressableHaptic style={styles.header} onPress={() => setCollapse(!collapse)}>
        <RNText style={styles.title}>{title}</RNText>
        <Animated.View style={[styles.iconDropdown, { transform: [{ rotate: rotate }] }]}>
          <SvgIcon name="remote" />
        </Animated.View>
      </PressableHaptic>
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

export default memo(AccountList, isEqual);
