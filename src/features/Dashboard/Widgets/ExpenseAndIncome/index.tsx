import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { MenuView } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { getExpenseIncomeInRangeDate } from 'database/querying';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR } from 'utils/constants';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import ProgressLineChart from 'components/ProgressLineChart';
import RNText from 'components/Text';
import { styles } from './styles';
import { AddSquare } from 'iconsax-react-native';
import { ROUTES } from 'navigation/constants/routes';

const dateViewSelect = [
  { title: 'Hôm nay', id: 'now' },
  { title: 'Tháng này', id: 'month' },
  { title: 'Quý này', id: 'quart' },
  { title: 'Năm nay', id: 'year' },
];

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

function ExpenseAndIncome({ title }: { title: string }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const [dateView, setDateView] = useState('month');
  const [data, setData] = useState<ExpenseIncomeData>({
    totalAmount: { income: 0, expense: 0 },
    categoryGroup: [],
  });

  useEffect(() => {
    getExpenseIncomeInRangeDate(dateView).then((res) => {
      if (res?.totalAmount?.length) {
        setData({ ...res, totalAmount: res.totalAmount[0] });
      }
    });
  }, [dateView]);

  const renderMenuTitle = dateViewSelect.find((item) => item.id === dateView)?.title || 'Tháng này';

  const currentBalance = data.totalAmount.income - data.totalAmount.expense;

  const getChartHeight = (value: number) => {
    const max = Math.max(data.totalAmount.income, data.totalAmount.expense);
    return max ? Math.max((value / max) * 100, 1) : 1;
  };

  const getProgressBarWidth = (value: number) =>
    data.totalAmount.expense ? ((value / data.totalAmount.expense) * 100).toFixed(2) : 0;

  const renderProgressLabel = ({ categoryName, categoryParentId, expense }: any, index: number) => (
    <View style={styles.barName} key={categoryParentId}>
      <View
        style={[styles.icon, { backgroundColor: MATERIAL_COLOR[index % MATERIAL_COLOR.length] }]}
      />
      <RNText fontSize={10} style={{ fontWeight: '300' }}>
        {`${categoryName} (${getProgressBarWidth(expense)}%)`}
      </RNText>
    </View>
  );

  const onNavigationToReport = () => {
    if (data.categoryGroup.length) {
      navigation.navigate(ROUTES.EXPENSE_INCOME_DETAIL, { dateView: renderMenuTitle });
    }
  };

  const onAddTransactionNow = () => {
    navigation.navigate(ROUTES.TRANSACTIONS);
  };

  return (
    <PressableHaptic
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onNavigationToReport}
    >
      <View style={styles.top}>
        <RNText preset="widgetTitle">{title}</RNText>
        {!!data.categoryGroup.length && (
          <MenuView
            title="Xem theo"
            onPressAction={({ nativeEvent: { event } }) => setDateView(event)}
            actions={dateViewSelect}
          >
            <View style={styles.dateView}>
              <RNText color="#00a8e8">{renderMenuTitle}</RNText>
              <SvgIcon name="forward" preset="forwardLink" color="#00a8e8" />
            </View>
          </MenuView>
        )}
      </View>

      {!data.categoryGroup.length ? (
        <View style={styles.noData}>
          <RNText color={colors.textSecondary} preset="subTitle">
            Hãy bắt đầu theo dõi chi tiêu của bạn!
          </RNText>
          <PressableHaptic style={styles.addTransactionNow} onPress={onAddTransactionNow}>
            <View style={styles.addTransactionNow}>
              <AddSquare size={15} variant="Broken" color={colors.primary} />
              <RNText color={colors.primary} style={{ fontWeight: '500' }}>
                Thêm chi tiêu ngay
              </RNText>
            </View>
          </PressableHaptic>
        </View>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.col}>
              {[
                { title: 'Thu', amount: data.totalAmount.income, color: '#17C03F' },
                { title: 'Chi', amount: data.totalAmount.expense, color: '#E25C5C' },
                { title: 'Số dư', amount: currentBalance, color: '#FCAA18' },
              ].map(({ title, amount, color }) => (
                <View key={title} style={styles.moneyItem}>
                  <View style={styles.moneyItemTitle}>
                    <View style={[styles.icon, { backgroundColor: color }]} />
                    <RNText>{title}</RNText>
                  </View>
                  <RNText color={color}>{formatNumber(amount, true)}</RNText>
                </View>
              ))}
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            </View>

            <View style={{ flex: 0.75 }}>
              <View style={styles.chartView}>
                {['#17C03F', '#E25C5C'].map((color, index) => (
                  <View
                    key={color}
                    style={[
                      styles.chart,
                      {
                        backgroundColor: color,
                        height: `${getChartHeight(
                          index === 0 ? data.totalAmount.income : data.totalAmount.expense,
                        )}%`,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.progressBar}>
            <ProgressLineChart
              data={data.categoryGroup.map(({ categoryName, expense }) => ({
                title: categoryName,
                value: expense,
              }))}
            />
          </View>

          <ScrollView
            horizontal
            centerContent
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: 'auto', paddingHorizontal: 10 }}
          >
            {data.categoryGroup.map(renderProgressLabel)}
          </ScrollView>
        </>
      )}
    </PressableHaptic>
  );
}

export default ExpenseAndIncome;
