import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { PieChart as PieChartComponent } from 'react-native-gifted-charts';
import RNText from 'components/Text';
import Empty from 'components/Empty';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR } from 'utils/constants';
import { DebtLoanTypes } from 'utils/types';
import styles from './styles';

function PieChart({ data, isDebt }: { data: DebtLoanTypes[]; isDebt: boolean }) {
  const { colors } = useCustomTheme();
  const emptyString = isDebt
    ? 'Không còn khoản cho vay nào cần thu'
    : 'Không còn khoản nợ nào cần trả';

  const pieData = useMemo(() => {
    return [...data]
      .filter((item) => item.value !== 0)
      .map((item, index) => ({
        color: MATERIAL_COLOR[index || 0],
        value: Math.abs(item.value),
        text: item.relatedPerson,
      }));
  }, [data]);

  const totalCurrentAccount = () => {
    if (!pieData || !pieData.length) {
      return 0;
    }
    return formatNumber(
      pieData.reduce((total, current) => (total += current.value), 0),
      true,
    );
  };

  const renderPieInnerComponent = () => {
    return (
      <View style={styles.pieInnerCenter}>
        <RNText fontSize={14} style={styles.fontWeight300}>
          Tổng
        </RNText>
        <RNText style={styles.totalAmount}>{totalCurrentAccount()}</RNText>
      </View>
    );
  };

  return (
    <View style={styles.pieChart}>
      {!!pieData.length ? (
        <>
          <PieChartComponent
            data={pieData}
            donut
            radius={90}
            strokeWidth={4}
            innerRadius={70}
            strokeColor={colors.background}
            innerCircleColor={colors.background}
            centerLabelComponent={renderPieInnerComponent}
          />
          <View style={{ paddingVertical: 10 }}>
            <ScrollView
              centerContent
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pieDescription}
            >
              {[...pieData].map((item) => {
                return (
                  <View key={item.color} style={styles.barName}>
                    <View style={[styles.icon, { backgroundColor: item.color }]} />
                    <RNText style={styles.fontWeight300}>{`${item.text} `}</RNText>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <Empty text={emptyString} />
        </View>
      )}
    </View>
  );
}
export default PieChart;
