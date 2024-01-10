import React, { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import {
  Empty,
  RNText,
  IconComponent,
  TouchableHighlightComponent,
  FlatListComponent,
} from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { TRANSACTION_CATEGORY_TYPE, VIEW_CATEGORY_FAST_BY_COLUMN } from 'utils/constant';
import { TTransactionsCategory } from 'database/types';
import { getMostUsedOrRecentTransaction } from 'services/api/transactionsCategory';
import { ITEM_WIDTH } from 'features/TransactionCategory/constants.config';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectViewCategoryMostAndRecent } from 'store/app/app.selector';
import { updateViewCategoryMostAndRecent } from 'store/app/app.slice';
import styles from './styles';

const ON = 'on';
const OFF = 'off';

export const mapTitle: { [key: string]: string } = {
  [VIEW_CATEGORY_FAST_BY_COLUMN.RECENT]: 'Sử dụng gần đây',
  [VIEW_CATEGORY_FAST_BY_COLUMN.MOST]: 'Hay sử dụng',
};

const dropDownDefault: MenuAction[] = [
  {
    id: VIEW_CATEGORY_FAST_BY_COLUMN.RECENT,
    title: 'Sử dụng gần đây',
  },
  {
    id: VIEW_CATEGORY_FAST_BY_COLUMN.MOST,
    title: 'Hay sử dụng',
  },
];

function MostAndRecent({ type }: { type: TRANSACTION_CATEGORY_TYPE }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const viewCategoryMostAndRecent = useAppSelector((state) =>
    selectViewCategoryMostAndRecent(state),
  );
  const dispatch = useAppDispatch();
  const [data, setData] = useState<TTransactionsCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRecentTransactionCategory(viewCategoryMostAndRecent);
    }, [type, viewCategoryMostAndRecent]),
  );

  const getRecentTransactionCategory = async (queryColumn: any) => {
    const res = await getMostUsedOrRecentTransaction({
      categoryType: type,
      column: queryColumn,
    });
    setData(res);
  };

  const renderActions = useMemo(() => {
    return dropDownDefault.map((x) => {
      x.state = x.id === viewCategoryMostAndRecent ? ON : OFF;
      return x;
    });
  }, [viewCategoryMostAndRecent]);

  const onHandlePressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    dispatch(updateViewCategoryMostAndRecent(event));
  };

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    navigation.navigate({
      name: navigation.getParent()?.getState().routes[0].params?.params?.returnScreen,
      params: { categoryId: category.id },
      merge: true,
    });
  };

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return (
      <TouchableHighlightComponent
        style={{ padding: 2 }}
        onPress={() => onItemCategoryPress(item)}
        key={item.id}
      >
        <View style={[styles.itemChild, { width: ITEM_WIDTH }]}>
          <View style={styles.iconView}>
            <IconComponent name={item.icon} size={24} />
          </View>
          <RNText numberOfLines={1} fontSize={12} style={{ opacity: 0.8 }}>
            {item.categoryName}
          </RNText>
        </View>
      </TouchableHighlightComponent>
    );
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
            {mapTitle[viewCategoryMostAndRecent]}
          </RNText>
          <IconComponent name="forward" size={14} opacity={0.7} color="#1BA7EF" />
        </View>
      </MenuView>
      <FlatListComponent data={data} horizontal renderItem={renderItem} />
      {!Boolean(data.length) && <Empty />}
    </View>
  );
}
export default memo(MostAndRecent, isEqual);
