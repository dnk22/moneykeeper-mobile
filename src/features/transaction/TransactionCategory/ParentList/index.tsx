import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Empty from 'components/Empty';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import FlatListComponent from 'components/FlatList';
import RNText from 'components/Text';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';
import { ROUTES } from 'navigation/constants/routes';
import { TTransactionsCategory } from 'database/types';
import { TransactionCategoryParamProps } from 'navigation/types';
import { categoriesLocalQuery } from 'database/querying/categories';
import ImageComponent from 'components/ImageComponent';
import styles from './styles';

function ParentList() {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionCategoryParamProps<typeof ROUTES.PARENT_LIST>['navigation']>();
  const { params } = useRoute<TransactionCategoryParamProps<typeof ROUTES.PARENT_LIST>['route']>();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    categoriesLocalQuery.getParentCategoryList(params.type).then((res) => {
      setData(res);
    });
  }, [params.type]);

  const onPress = (item: TTransactionsCategory) => {
    navigation.popTo(ROUTES.UPDATE_TRANSACTION_CATEGORY, {
      parentId: item.id,
    });
  };

  function onRenderItem({ item }: { item: TTransactionsCategory }) {
    return (
      <TouchableHighlightComponent onPress={() => onPress(item)}>
        <View style={[styles.item, { backgroundColor: colors.surface }]}>
          <ImageComponent source={{ uri: item.icon }} size={32} />
          <RNText>{item.categoryName}</RNText>
        </View>
      </TouchableHighlightComponent>
    );
  }

  return (
    <View style={styles.container}>
      <FlatListComponent data={data} renderItem={onRenderItem} ListEmptyComponent={<Empty />} />
    </View>
  );
}
export default ParentList;
