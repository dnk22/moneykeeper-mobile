import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import FlatListComponent from 'components/FlatList';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import InputSearch from 'components/InputSearch';
import PressableHaptic from 'components/PressableHaptic';
import { ROUTES } from 'navigation/constants/routes';
import { Add } from 'iconsax-react-native';
import { TransactionCategoryParamProps } from 'navigation/types/transactionCategory';
import TransactionCategoryHeaderRight from 'navigation/components/TransactionCategoryHeaderRight';
import { CategoryContext } from 'navigation/tabs/TransactionCategoryTabs';
import { categoriesLocalQuery } from 'database/querying/categories';
import { showToast } from 'utils/system';
import debounce from 'lodash/debounce';
import ParentItem from './ParentItem';
import MostAndRecent from './MostAndRecent';
import { mapTitle, mapTransactionCategoryType } from '../constants.config';
import { filterAndBuildParentChild } from './helpter';
import { styles } from './styles';

function ExpenseIncomeTab({ type }: { type: TRANSACTION_CATEGORY_TYPE }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<TransactionCategoryParamProps['navigation']>();
  const { name } = useRoute<TransactionCategoryParamProps['route']>();

  const { isEditable, setUpdateMode } = useContext(CategoryContext);
  const [data, setCategoryData] = useState<any>([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      try {
        categoriesLocalQuery.getExpenseIncome({ type }).then((result) => {
          setCategoryData(result);
        });
      } catch (error) {
        showToast({
          type: 'error',
          text2: 'Không thể tải danh sách danh mục',
        });
      }
    }, [type]),
  );

  useFocusEffect(
    useCallback(() => {
      // Set the header title and right button based on the current tab
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          headerTitle: mapTitle[name],
          headerRight: () => (
            <TransactionCategoryHeaderRight
              isEditable={isEditable}
              onPress={() => setUpdateMode(!isEditable)}
            />
          ),
        });
      }
    }, [isEditable]),
  );

  const handleOnSearch = debounce((text: string) => {
    setSearchText(text);
  }, 200);

  const navigateToAddCategory = () => {
    navigation.navigate(ROUTES.UPDATE_TRANSACTION_CATEGORY, {
      type: mapTransactionCategoryType[name ?? ROUTES.EXPENSE_CATEGORY],
    });
  };

  const renderItem = ({
    item,
  }: {
    item: TTransactionsCategory & { children: TTransactionsCategory[] };
  }) => {
    return <ParentItem data={item} />;
  };

  const dataGrouped = useMemo(() => {
    return filterAndBuildParentChild({ data, searchText, sortBy: 'categoryName' });
  }, [data, searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <InputSearch
          placeholder="Tìm kiếm danh mục"
          onChangeText={handleOnSearch}
          backgroundColor={colors.surface}
        />
        <MostAndRecent type={type} />
      </View>
      <View style={{ flex: 1 }}>
        <FlatListComponent
          data={dataGrouped}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
        />
        {isEditable && (
          <PressableHaptic
            style={[styles.addIcon, { backgroundColor: colors.primary }]}
            onPress={navigateToAddCategory}
          >
            <Add size="28" color="white" />
          </PressableHaptic>
        )}
      </View>
    </View>
  );
}

export default ExpenseIncomeTab;
