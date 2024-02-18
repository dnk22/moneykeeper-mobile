import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { styles } from './styles';
import { useCustomTheme } from 'resources/theme';
import { RNText, SvgIcon } from 'components/index';
import { MenuView } from '@react-native-menu/menu';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenseIncomeInRangeDate } from 'database/querying';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR } from 'utils/constant';
import FlatList from 'components/FlatList';

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

type DATA = {
  totalAmount: { income: number; expense: number };
  categoryGroup: { categoryName: string; categoryParentId: string; expense: number }[];
};

function ExpenseAndIncome() {
  const { colors } = useCustomTheme();
  const [dateView, setDateView] = useState('month');
  const [data, setData] = useState<DATA>({
    totalAmount: { income: 0, expense: 0 },
    categoryGroup: [],
  });

  useFocusEffect(
    useCallback(() => {
      getExpenseIncomeInRangeDate(dateView).then((res) => {
        if (res && res.totalAmount.length) {
          setData({
            ...res,
            totalAmount: res.totalAmount[0],
          });
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
    return formatNumber(data.totalAmount.income - data.totalAmount.expense, true);
  };

  const getChartHeight = (value: number) => {
    const point =
      data.totalAmount.income > data.totalAmount?.expense
        ? data.totalAmount.income
        : data.totalAmount.expense;
    return (value / point) * 100;
  };

  const getProgressBarWidth = (value: number) => {
    return ((value / data.totalAmount.expense) * 100).toFixed(2);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.top}>
        <RNText preset="widgetTitle">Tổng quát chi tiêu</RNText>
        <MenuView title="Xem theo" onPressAction={onChangeDateView} actions={dateViewSelect}>
          <View style={styles.dateView}>
            <RNText color="#00a8e8">{renderMenuTitle()}</RNText>
            <SvgIcon name="forward" preset="forwardLink" color="#00a8e8" />
          </View>
        </MenuView>
      </View>
      {!!!data.categoryGroup.length && (
        <View style={styles.noData}>
          <RNText color="red">{`${renderMenuTitle()} bạn chưa có ghi chép nào!`}</RNText>
        </View>
      )}
      {!!data.categoryGroup.length && (
        <>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.moneyItem}>
                <View style={styles.moneyItemTitle}>
                  <View style={[styles.icon, styles.incomeIcon]} />
                  <RNText>Thu</RNText>
                </View>
                <RNText color="#17C03F">{formatNumber(data.totalAmount.income, true)}</RNText>
              </View>
              <View style={styles.moneyItem}>
                <View style={styles.moneyItemTitle}>
                  <View style={[styles.icon, styles.expenseIcon]} />
                  <RNText>Chi</RNText>
                </View>
                <RNText color="#E25C5C">{formatNumber(data.totalAmount.expense, true)}</RNText>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <View style={[styles.moneyItem]}>
                <View style={styles.moneyItemTitle}>
                  <View style={[styles.icon, styles.balanceIcon]} />
                  <RNText>Số dư</RNText>
                </View>
                <RNText color="#FCAA18">{currentBalance()}</RNText>
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
                        height: `${getChartHeight(data.totalAmount.income) || 1}%`,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.chart,
                      styles.chartBalance,
                      {
                        height: `${
                          getChartHeight(data.totalAmount.income - data.totalAmount.expense) || 1
                        }%`,
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.chart,
                    {
                      backgroundColor: '#E25C5C',
                      height: `${getChartHeight(data.totalAmount.expense) || 1}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={styles.progressBar}>
            {data.categoryGroup.map((item, index) => {
              return (
                <View
                  key={item.categoryParentId}
                  style={{
                    width: `${getProgressBarWidth(item.expense)}%`,
                    backgroundColor: MATERIAL_COLOR[index],
                  }}
                />
              );
            })}
          </View>
          <ScrollView
            horizontal
            centerContent
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: 'auto' }}
          >
            <FlatList
              id="categoryParentId"
              contentContainerStyle={{ gap: 10 }}
              scrollEnabled={false}
              numColumns={Math.ceil(data.categoryGroup.length / 2)}
              key={data.categoryGroup.length}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={true}
              data={data.categoryGroup}
              renderItem={({ item, index }) => (
                <View
                  style={[styles.barName, { gap: 8, marginRight: 20 }]}
                  key={item.categoryParentId}
                >
                  <View style={[styles.icon, { backgroundColor: MATERIAL_COLOR[index] }]} />
                  <RNText fontSize={10} style={{ fontWeight: '300' }}>{`${
                    item.categoryName
                  } (${getProgressBarWidth(item.expense)}%)`}</RNText>
                </View>
              )}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
}
export default ExpenseAndIncome;
