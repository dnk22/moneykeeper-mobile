import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { FlatListComponent, InputSearch } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';
import { getExpenseAndIncome } from 'services/api/transactionsCategory';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import ParentItem from './ParentItem';
import MostAndRecent from './MostAndRecent';
import { isEmpty } from 'lodash';

type ExpenseIncomeTabProps = {
  type: TRANSACTION_CATEGORY_TYPE;
};

function ExpenseIncomeTab({ type }: ExpenseIncomeTabProps) {
  const { colors } = useCustomTheme();
  const initialData = useRef<any>([]);
  const [data, setData] = useState<any>([]);

  const getExpenseIncomeData = async () => {
    const result = await getExpenseAndIncome({ type });
    initialData.current = result;
    convertDataToGroup(result);
  };

  const convertDataToGroup = (data: TTransactionsCategory[]) => {
    if (isEmpty(data)) {
      setData([]);
      return;
    }

    // Group the data by parentId
    const groupedData: { [key: string]: TTransactionsCategory[] } = data.reduce((acc, item) => {
      const parentId = item.parentId || 'parent'; // Use empty string if parentId is null
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(item);
      return acc;
    }, {});

    if (!groupedData['parent']) {
      return;
    }

    // Create a new array with the desired structure
    const newData = groupedData['parent'].map((item) => {
      const newItem = { ...item };
      newItem.children = groupedData[item.id] || [];
      return newItem;
    });
    setData(newData);
  };

  function searchByText(
    data: TTransactionsCategory[],
    searchText: string,
  ): TTransactionsCategory[] {
    const resultMap = new Map<string, TTransactionsCategory>();
    function searchRecursive(item: TTransactionsCategory): TTransactionsCategory | null {
      const isMatch = item.categoryName.toLowerCase().includes(searchText.toLowerCase());
      const newItem: TTransactionsCategory = { ...item };
      if (isMatch || (item.children && item.children.length > 0)) {
        newItem.children = (item.children || []).map(searchRecursive).filter(Boolean);
        if (!resultMap.has(item.id)) {
          resultMap.set(item.id, newItem);
        }
        if (item.parentId && !resultMap.has(item.parentId)) {
          const parent = data.find((parentItem) => parentItem.id === item.parentId);
          if (parent) {
            resultMap.set(parent.id, parent);
            searchRecursive(parent);
          }
        }
      }
      return newItem;
    }
    data.forEach((item) => {
      searchRecursive(item);
    });
    return Array.from(resultMap.values());
  }

  useFocusEffect(
    useCallback(() => {
      getExpenseIncomeData();
    }, [type]),
  );

  const renderItem = ({
    item,
  }: {
    item: TTransactionsCategory & { children: TTransactionsCategory[] };
  }) => {
    return <ParentItem data={item} />;
  };

  const handleOnSearch = (text: string) => {
    if (!text) {
      convertDataToGroup(initialData.current);
    } else {
      const searchResults = searchByText(initialData.current, text);
      convertDataToGroup(searchResults);
    }
  };

  return (
    <View style={{ padding: 6, flex: 1 }}>
      <InputSearch
        placeholder="Nhập tên"
        onChangeText={handleOnSearch}
        backgroundColor={colors.surface}
        style={{ marginBottom: 10 }}
      />
      <MostAndRecent type={type} />
      <View style={{ flex: 1 }}>
        <FlatListComponent data={data} renderItem={renderItem} />
      </View>
    </View>
  );
}

export default ExpenseIncomeTab;
