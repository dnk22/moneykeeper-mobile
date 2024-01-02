import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import {
  Empty,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
  FlatListComponent,
} from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { MOST, RECENT, TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import { TTransactionsCategory } from 'database/types';
import { getMostUsedOrRecentTransaction } from 'services/api/transactionsCategory';
import { ITEM_WIDTH } from 'features/TransactionCategory/constants.config';
import styles from './styles';

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
  const navigation = useNavigation<any>();
  const [fastView, setFastView] = useState<typeof MOST | typeof RECENT>(MOST);
  const [data, setData] = useState<TTransactionsCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRecentTransactionCategory(fastView);
    }, [type, fastView]),
  );
  
  const getRecentTransactionCategory = async (queryColumn: typeof MOST | typeof RECENT) => {
    const res = await getMostUsedOrRecentTransaction({
      categoryType: type,
      column: queryColumn,
    });
    setData(res);
  };

  const renderActions = useMemo(() => {
    return dropDownDefault.map((x) => {
      x.state = x.id === fastView ? ON : OFF;
      return x;
    });
  }, [fastView]);

  const onHandlePressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    setFastView(event);
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
          <View style={styles.iconView}>{/* <SvgIcon name={item.icon} size={24} /> */}</View>
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
            {mapTitle[fastView]}
          </RNText>
          <SvgIcon name="forward" size={14} opacity={0.7} color="#1BA7EF" />
        </View>
      </MenuView>
      <View style={{ alignItems: 'center' }}>
        <FlatListComponent
          data={data}
          horizontal
          renderItem={renderItem}
          ListEmptyComponent={<Empty />}
        />
      </View>
    </View>
  );
}
export default memo(MostAndRecent, isEqual);
