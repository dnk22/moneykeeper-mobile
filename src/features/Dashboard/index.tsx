import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { selectWidgetOrder } from 'store/app/app.selector';
import { useSelector } from 'react-redux';
import FinancialStatement from './Widgets/FinancialStatement';
import { WIDGET_IMPORT_LIST } from './constants';
import isArray from 'lodash/isArray';
import { importDefaultBanksData } from 'database/querying';
import { useAppDispatch } from 'store/index';
import { importTransactionCategoryData } from 'services/api/transactionsCategory';
import { setLendBorrowData } from 'store/transactionCategory/transactionCategory.slice';
import styles from './styles';

function Dashboard() {
  const { colors } = useCustomTheme();
  const widgetOrder = useSelector((state) => selectWidgetOrder(state));
  const useDispatch = useAppDispatch();

  async function prepareInitData() {
    importDefaultBanksData();
    importTransactionCategoryData().then((res) => {
      if (res.success) {
        const data = (res.data || []).reduce((accumulator, currentValue) => {
          accumulator[currentValue.id] = currentValue.categoryName;
          return accumulator;
        }, {});
        useDispatch(setLendBorrowData(data));
      }
    });
  }
  useEffect(() => {
    prepareInitData();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FinancialStatement />
      <ScrollView style={styles.widgetView}>
        {isArray(widgetOrder) &&
          widgetOrder.map((item) => {
            if (item.isActive) {
              const Widget = WIDGET_IMPORT_LIST[item.key].default;
              return <Widget key={item.key} title={item.label} />;
            }
          })}
      </ScrollView>
    </View>
  );
}

export default Dashboard;
