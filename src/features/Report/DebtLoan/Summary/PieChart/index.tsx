import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { PieChart as PieChartComponent } from 'react-native-gifted-charts';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR } from 'utils/constant';
import { DebtLoanTypes } from 'utils/types';
import styles from './styles';

function PieChart({ data }: { data: DebtLoanTypes[] }) {
  const { colors } = useCustomTheme();

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
        <RNText fontSize={18} style={styles.totalAmount}>
          {totalCurrentAccount()}
        </RNText>
      </View>
    );
  };

  return (
    <View style={styles.pieChart}>
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
    </View>
  );
}
export default PieChart;
