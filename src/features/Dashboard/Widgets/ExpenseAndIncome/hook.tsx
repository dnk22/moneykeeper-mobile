import { useState, useEffect } from 'react';
import { ROUTES } from 'navigation/constants/routes';

import { useNavigation } from '@react-navigation/native';
import { getExpenseIncomeInRangeDate } from 'database/querying';
import { dateViewSelect } from './const';

type ExpenseIncomeData = {
  totalAmount: {
    income: number;
    expense: number;
  };
  categoryGroup: {
    categoryName: string;
    categoryParentId: string;
    expense: number;
  }[];
};

export const useExpenseAndIncomeHook = () => {
  const navigation = useNavigation<any>();
  const [dateView, setDateView] = useState('month');
  const [data, setData] = useState<ExpenseIncomeData>({
    totalAmount: { income: 0, expense: 0 },
    categoryGroup: [],
  });

  const renderMenuTitle = dateViewSelect.find((item) => item.id === dateView)?.title || 'Tháng này';

  const progressLineData =
    data.categoryGroup.map(({ categoryName, expense }) => ({
      title: categoryName,
      value: expense,
    })) || [];

  useEffect(() => {
    getExpenseIncomeInRangeDate(dateView).then((res) => {
      if (res?.totalAmount?.length) {
        setData({ ...res, totalAmount: res.totalAmount[0] });
      }
    });
  }, [dateView]);

  const getChartHeight = (value: number) => {
    const max = Math.max(data.totalAmount.income, data.totalAmount.expense);
    return max ? Math.max((value / max) * 100, 1) : 1;
  };

  const getProgressBarWidth = (value: number) =>
    data.totalAmount.expense ? ((value / data.totalAmount.expense) * 100).toFixed(2) : 0;

  const onNavigationToDetail = () => {
    if (data.categoryGroup.length) {
      navigation.navigate(ROUTES.EXPENSE_INCOME_DETAIL, { dateView: renderMenuTitle });
    }
  };

  return {
    data,
    dateViewSelect,
    progressLineData,
    renderMenuTitle,
    setDateView,
    getChartHeight,
    getProgressBarWidth,
    onNavigationToDetail,
  };
};
