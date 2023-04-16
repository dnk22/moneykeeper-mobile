import { memo, useEffect, useMemo, useState } from 'react';
import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { Empty, RNText, SvgIcon } from 'components/index';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { getMostUsedOrRecentTransactionCategoryUsed } from 'database/querying';
import { MOST, RECENT, TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import { TTransactionsCategory } from 'database/types';
import GroupChild from '../common/GroupChild';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectMostOrRecentMode } from 'store/app/app.selector';
import { updateMostOrRecentMode } from 'store/app/app.slice';

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
  const dispatch = useAppDispatch();
  const { expense, income } = useAppSelector((state) => selectMostOrRecentMode(state));
  const fastSelectType = type === TRANSACTION_CATEGORY_TYPE.EXPENSE ? expense : income;
  const [data, setData] = useState<TTransactionsCategory[]>([]);

  useEffect(() => {
    getRecentTransactionCategory();
  }, [fastSelectType]);

  const getRecentTransactionCategory = async () => {
    const res = await getMostUsedOrRecentTransactionCategoryUsed({
      categoryType: type,
      column: fastSelectType,
    });
    setData(res);
  };

  const renderActions = useMemo(() => {
    return dropDownDefault.map((x) => {
      x.state = x.id === fastSelectType ? ON : OFF;
      return x;
    });
  }, [fastSelectType]);

  const onHandlePressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    const typeAs =
      type === TRANSACTION_CATEGORY_TYPE.EXPENSE ? { expense: event } : { income: event };
    dispatch(updateMostOrRecentMode(typeAs));
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
      <MenuView
        style={styles.selectAs}
        title="Chọn nhanh theo"
        onPressAction={onHandlePressAction}
        actions={renderActions}
      >
        <View style={styles.menu}>
          <RNText color="#1BA7EF" style={{ opacity: 0.7 }}>
            {mapTitle[fastSelectType]}
          </RNText>
          <SvgIcon name="forward" size={14} opacity={0.7} color="#1BA7EF" />
        </View>
      </MenuView>
      {data.length ? (
        <GroupChild data={data} onItemCategoryPress={onItemCategoryPress} isDisabled horizontal />
      ) : (
        <Empty />
      )}
    </View>
  );
}
export default memo(MostAndRecent, isEqual);
