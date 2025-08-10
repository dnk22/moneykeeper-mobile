import React, { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import ImageComponent from 'components/ImageComponent';
import Empty from 'components/Empty';
import RNText from 'components/Text';
import FlatListComponent from 'components/FlatList';

import { useCustomTheme } from 'resources/theme';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { TTransactionsCategory } from 'database/types';
import { ITEM_WIDTH } from 'features/transaction/TransactionCategory/constants.config';
import { TransactionCategoryParamProps } from 'navigation/types';
import { categoriesLocalQuery } from 'database/querying/categories';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { ArrowRight2 } from 'iconsax-react-native';
import { updateCategoriesConfig } from 'store/app/app.thunk';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectCategoriesConfig } from 'store/app/app.selector';
import { mapTitle, MENU_DATA, VIEW_OPTION } from './const';
import styles from './styles';

function MostAndRecent({ type }: { type: TRANSACTION_CATEGORY_TYPE }) {
  const { colors } = useCustomTheme();
  const dispatch = useAppDispatch();
  const { params } = useRoute<any>();
  const navigation = useNavigation<TransactionCategoryParamProps['navigation']>();

  const { quickSelectBy = VIEW_OPTION.useCount } = useAppSelector((state) =>
    selectCategoriesConfig(state),
  );
  const [data, setData] = useState<TransactionCategoryModel[]>([]);

  useFocusEffect(
    useCallback(() => {
      categoriesLocalQuery
        .getMostUsedOrRecentCategories({
          categoryType: type,
          column: quickSelectBy,
        })
        .then((res) => {
          setData(res);
        });
    }, [type, quickSelectBy]),
  );

  const onMenuChange = ({ nativeEvent: { event } }: NativeActionEvent) => {
    dispatch(
      updateCategoriesConfig({
        quickSelectBy: event as 'useCount' | 'lastUseAt',
      }),
    );
  };

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    navigation.popTo(params.returnScreen, { categoryId: category.id });
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
            <ImageComponent name={item.icon} size={22} />
          </View>
          <RNText numberOfLines={1} fontSize={12} style={{ opacity: 0.8 }}>
            {item.categoryName}
          </RNText>
        </View>
      </TouchableHighlightComponent>
    );
  };

  const renderActions = useMemo(() => {
    return MENU_DATA.map((x) => ({
      ...x,
      state: x.id === quickSelectBy ? ('on' as const) : ('off' as const),
    }));
  }, [quickSelectBy]);

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <MenuView
        style={styles.selectAs}
        title="Chọn nhanh theo"
        onPressAction={onMenuChange}
        actions={renderActions}
      >
        <View style={styles.menu}>
          <RNText color={colors.primary}>{mapTitle[quickSelectBy]}</RNText>
          <ArrowRight2 size={16} color={colors.primaryVariant} />
        </View>
      </MenuView>
      <FlatListComponent data={data} horizontal renderItem={renderItem} />
      {!Boolean(data.length) && <Empty />}
    </View>
  );
}
export default memo(MostAndRecent, isEqual);
