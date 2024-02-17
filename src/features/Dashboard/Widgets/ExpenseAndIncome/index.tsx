import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useCustomTheme } from 'resources/theme';
import { RNText, SvgIcon } from 'components/index';
import { MenuView } from '@react-native-menu/menu';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenseIncomeInRangeDate } from 'database/querying';
import { formatNumber } from 'utils/math';

const dateViewSelect = [
  {
    title: 'Hôm nay',
    id: 'now',
  },
  {
    title: 'Tháng này',
    id: 'month',
  },
  {
    title: 'Quý này',
    id: 'quart',
  },
  {
    title: 'Năm nay',
    id: 'year',
  },
];

function ExpenseAndIncome() {
  const { colors } = useCustomTheme();
  const [dateView, setDateView] = useState('month');
  const [data, setData] = useState({ totalExpense: 0, totalIncome: 0 });

  useFocusEffect(
    useCallback(() => {
      getExpenseIncomeInRangeDate(dateView).then((res) => {
        if (res && res.length) {
          setData(res[0]);
        }
      });
    }, [dateView]),
  );

  const onChangeDateView = ({ nativeEvent: { event } }: any) => {
    setDateView(event);
  };

  const renderMenuTitle = () => {
    return dateViewSelect.find((item) => item.id === dateView)?.title;
  };

  const currentBalance = () => {
    return formatNumber(data.totalIncome - data.totalExpense, true);
  };

  const getChartHeight = (value: number) => {
    const point = data.totalIncome > data.totalExpense ? data.totalIncome : data.totalExpense;
    return (value / point) * 100;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.top}>
        <RNText preset="widgetTitle">Tổng quát chi tiêu</RNText>
        <MenuView
          style={{ width: 20 }}
          title="Xem theo"
          onPressAction={onChangeDateView}
          actions={dateViewSelect}
        >
          <View style={styles.dateView}>
            <RNText color="#00a8e8">{renderMenuTitle()}</RNText>
            <SvgIcon name="forward" preset="forwardLink" color="#00a8e8" />
          </View>
        </MenuView>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <View style={styles.moneyItem}>
            <View style={styles.moneyItemTitle}>
              <View style={[styles.icon, styles.incomeIcon]} />
              <RNText>Thu</RNText>
            </View>
            <RNText color="#17C03F">{formatNumber(data.totalIncome, true)}</RNText>
          </View>
          <View style={styles.moneyItem}>
            <View style={styles.moneyItemTitle}>
              <View style={[styles.icon, styles.expenseIcon]} />
              <RNText>Chi</RNText>
            </View>
            <RNText color="#893547">{formatNumber(data.totalExpense, true)}</RNText>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={[styles.moneyItem]}>
            <View style={styles.moneyItemTitle}>
              <View style={[styles.icon, styles.balanceIcon]} />
              <RNText>Số dư</RNText>
            </View>
            <RNText color="#CCB57A">{currentBalance()}</RNText>
          </View>
        </View>
        <View style={{ flex: 0.75 }}>
          <View style={styles.chartView}>
            <View>
              <View
                style={[
                  styles.chart,
                  {
                    backgroundColor: '#17C03F',
                    height: `${getChartHeight(data.totalIncome || 1)}%`,
                  },
                ]}
              />
              <View
                style={[
                  styles.chart,
                  styles.chartBalance,
                  {
                    height: `${getChartHeight(data.totalIncome - data.totalExpense || 1)}%`,
                  },
                ]}
              />
            </View>
            <View
              style={[
                styles.chart,
                {
                  backgroundColor: '#893547',
                  height: `${getChartHeight(data.totalExpense) || 1}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
export default ExpenseAndIncome;
