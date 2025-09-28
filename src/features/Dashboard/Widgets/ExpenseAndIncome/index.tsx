import { memo } from 'react';
import { ScrollView, View } from 'react-native';
import PressableHaptic from 'components/PressableHaptic';
import ProgressLineChart from 'components/ProgressLineChart';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { MenuView } from '@react-native-menu/menu';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR } from 'utils/constants';
import isEqual from 'react-fast-compare';
import EmptyData from './components/EmptyData';
import { useExpenseAndIncomeHook } from './hook';
import { styles } from './styles';
import { ArrowDown2 } from 'iconsax-react-native';

function ExpenseAndIncome({ title }: { title: string }) {
  const { colors } = useCustomTheme();
  const {
    data,
    dateViewSelect,
    progressLineData,
    renderMenuTitle,
    setDateView,
    getChartHeight,
    getProgressBarWidth,
    onNavigationToDetail,
  } = useExpenseAndIncomeHook();

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

  return (
    <PressableHaptic
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onNavigationToDetail}
    >
      <PressableHaptic
        style={styles.top}
        onPress={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <RNText preset="widgetTitle">{title}</RNText>
        <MenuView
          title="Xem theo"
          onPressAction={({ nativeEvent: { event } }) => setDateView(event)}
          actions={dateViewSelect}
        >
          <View style={styles.dateView}>
            <RNText color={colors.primaryVariant}>{renderMenuTitle}</RNText>
            <ArrowDown2 size="16" color={colors.primaryVariant} />
          </View>
        </MenuView>
      </PressableHaptic>

      {/* {!data.categoryGroup.length ? (
        <EmptyData colors={colors} />
      ) : (
        <> */}
      <View style={styles.row}>
        <View style={styles.col}>
          <View key={'Thu'} style={styles.moneyItem}>
            <View style={styles.moneyItemTitle}>
              <View style={[styles.icon, { backgroundColor: colors.green }]} />
              <RNText>{'Thu'}</RNText>
            </View>
            <RNText color={colors.green}>{formatNumber(data.totalAmount.income, true)}</RNText>
          </View>
          <View key={'Chi'} style={styles.moneyItem}>
            <View style={styles.moneyItemTitle}>
              <View style={[styles.icon, { backgroundColor: colors.error }]} />
              <RNText>{'Chi'}</RNText>
            </View>
            <RNText color={colors.error}>{formatNumber(data.totalAmount.expense, true)}</RNText>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View key={'Số dư'} style={styles.moneyItem}>
            <View style={styles.moneyItemTitle}>
              <View style={[styles.icon, { backgroundColor: colors.alert }]} />
              <RNText>{'Số dư'}</RNText>
            </View>
            <RNText color={colors.alert}>
              {formatNumber(data.totalAmount.income - data.totalAmount.expense, true)}
            </RNText>
          </View>
        </View>

        <View style={{ flex: 0.5 }}>
          <View style={styles.chartView}>
            {[colors.green, colors.error].map((color, index) => (
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

      {data.categoryGroup && data.categoryGroup.length > 0 && (
        <>
          <View style={styles.progressBar}>
            <ProgressLineChart height={10} data={progressLineData} />
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
      {/* </>
      )} */}
    </PressableHaptic>
  );
}

export default memo(ExpenseAndIncome, isEqual);
