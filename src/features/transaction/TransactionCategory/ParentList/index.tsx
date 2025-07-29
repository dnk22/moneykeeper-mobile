import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TTransactionsCategory } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { TransactionCategoryParamProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import { getParentList } from 'services/api/transactionsCategory';
import Empty from 'components/Empty';
import SvgIcon from 'components/SvgIcon';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import FlatListComponent from 'components/FlatList';
import RNText from 'components/Text';
import styles from './styles';

function ParentList() {
  const navigation =
    useNavigation<TransactionCategoryParamProps<typeof ROUTES.TRANSACTION_CATEGORY_LIST>['navigation']>();
  const { colors } = useCustomTheme();
  const { params } = useRoute<TransactionCategoryParamProps<typeof ROUTES.TRANSACTION_CATEGORY_LIST>['route']>();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getParentList(params.type).then((res) => setData(res));
  }, [params.type]);

  const onPress = (item: TTransactionsCategory) => {
    navigation.navigate({
      name: ROUTES.UPDATE_TRANSACTION_CATEGORY,
      params: { parentId: item.id },
      merge: true,
    });
  };

  function onRenderItem({ item }: { item: TTransactionsCategory }) {
    return (
      <TouchableHighlightComponent onPress={() => onPress(item)}>
        <View style={[styles.item, { backgroundColor: colors.surface }]}>
          <SvgIcon name={item.icon} size={30} />
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
