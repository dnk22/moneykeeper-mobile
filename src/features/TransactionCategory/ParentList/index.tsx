import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatListComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchGroupTransactionCategory } from 'database/querying';
import { TTransactionsCategory } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { PARENT_LIST, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { TransactionCategoryParamProps } from 'navigation/types';
import styles from './styles';

function ParentList() {
  const navigation =
    useNavigation<TransactionCategoryParamProps<typeof PARENT_LIST>['navigation']>();
  const { colors } = useCustomTheme();
  const { params } = useRoute<TransactionCategoryParamProps<typeof PARENT_LIST>['route']>();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetchGroup();
  }, []);

  async function fetchGroup() {
    const res = await fetchGroupTransactionCategory(params.type);
    setData(res);
  }
  const onPress = (item: TTransactionsCategory) => {
    navigation.navigate({
      name: UPDATE_TRANSACTION_CATEGORY,
      params: { parentId: item.id },
      merge: true,
    });
  };

  function onRenderItem({ item }: { item: TTransactionsCategory }) {
    return (
      <TouchableHighlightComponent onPress={() => onPress(item)}>
        <View style={[styles.item, { backgroundColor: colors.surface }]}>
          <SvgIcon name={item.icon} size={32} preset="transactionType" />
          <RNText>{item.categoryName}</RNText>
        </View>
      </TouchableHighlightComponent>
    );
  }

  return (
    <View style={styles.container}>
      <FlatListComponent data={data} renderItem={onRenderItem} />
    </View>
  );
}
export default ParentList;
