import { memo, useEffect, useMemo, useState } from 'react';
import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { RNText, SvgIcon } from 'components/index';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { getRecentTransactionCategoryUsed } from 'database/querying';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import { TTransactionsCategory } from 'database/types';
import GroupChild from '../common/GroupChild';
import { useNavigation } from '@react-navigation/native';

const RECENT = 'recent';
const MOST = 'most';
const ON = 'on';
const OFF = 'off';

export const mapTitle: { [key: string]: string } = {
  [RECENT]: 'Sử dụng gần đây',
  [MOST]: 'Hay sử dụng',
};

const dropDownDefault: MenuAction[] = [
  {
    id: RECENT,
    title: 'Sử dụng gần đây',
  },
  {
    id: MOST,
    title: 'Hay sử dụng',
  },
];

function MostAndRecent({ type }: { type: TRANSACTION_CATEGORY_TYPE }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const [data, setData] = useState<TTransactionsCategory[]>([]);
  const [viewType, setViewType] = useState<typeof RECENT | typeof MOST>(RECENT);

  useEffect(() => {
    if (viewType === RECENT) {
      getRecentTransactionCategory();
    }
  }, [viewType]);

  const getRecentTransactionCategory = async () => {
    const res = await getRecentTransactionCategoryUsed({ categoryType: type });
    setData(res);
  };

  const renderActions = useMemo(() => {
    return dropDownDefault.map((x) => {
      x.state = x.id === viewType ? ON : OFF;
      return x;
    });
  }, [viewType]);

  const onHandlePressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    setViewType(event);
  };

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    navigation.navigate({
      name: navigation.getParent()?.getState().routes[0].params?.returnScreen,
      params: { categoryId: category.id },
      merge: true,
    });
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <MenuView title="Xem nhanh" onPressAction={onHandlePressAction} actions={renderActions}>
        <View style={styles.menu}>
          <RNText color="#1BA7EF" style={{ opacity: 0.7 }}>
            Sử dụng gần đây
          </RNText>
          <SvgIcon name="forward" size={14} opacity={0.7} color="#1BA7EF" />
        </View>
      </MenuView>
      <GroupChild data={data} onItemCategoryPress={onItemCategoryPress} isDisabled horizontal />
    </View>
  );
}
export default memo(MostAndRecent, isEqual);
