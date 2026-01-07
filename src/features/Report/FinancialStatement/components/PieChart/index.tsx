import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { PieChart as PieChartComponent } from 'react-native-gifted-charts';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import { useAppSelector } from 'store/index';
import {
  selectDataSummary,
  selectDataDetail,
  selectViewType,
} from '../../reducer/financialStatement.selector';
import { MATERIAL_COLOR } from 'utils/constants';
import styles from './styles';

function PieChart() {
  const { colors } = useCustomTheme();
  const dataSummary = useAppSelector((state) => selectDataSummary(state));
  const itemDetailSelected = useAppSelector((state) => selectDataDetail(state));
  const isOwnedViewType = useAppSelector((state) => selectViewType(state));

  const dataFocus = useMemo(() => {
    if (itemDetailSelected) {
      return dataSummary && dataSummary.find((item) => item.accountName === itemDetailSelected)?.data;
    } else {
      return dataSummary;
    }
  }, [dataSummary, itemDetailSelected]);

  const pieData = useMemo(() => {
    return [...dataFocus].map((item, index) => ({
      color: MATERIAL_COLOR[index || 0],
      value: item.value,
      text: item.relatedPerson || item.accountName,
    }));
  }, [dataFocus]);

  const totalCurrentAccount = useMemo(() => {
    if (!pieData || !pieData.length) {
      return 0;
    }
    return formatNumber(
      [...dataFocus].reduce((total, current) => (total += current.value), 0),
      true,
    );
  }, [dataFocus]);

  const innerTitle = useMemo(() => {
    if (itemDetailSelected) {
      return dataFocus[0].categoryName || dataFocus[0].accountTypeName;
    } else {
      return isOwnedViewType ? 'Tổng Sở hữu' : 'Tổng dư nợ';
    }
  }, [isOwnedViewType, itemDetailSelected]);

  const renderPieInnerComponent = () => {
    return (
      <View style={styles.pieInnerCenter}>
        <RNText fontSize={14} style={styles.fontWeight300}>
          {innerTitle}
        </RNText>
        <RNText fontSize={18} style={styles.totalAmount}>
          {totalCurrentAccount}
        </RNText>
      </View>
    );
  };

  return (
    <>
      <View style={styles.pieChart}>
        <PieChartComponent
          showGradient
          donut
          strokeWidth={4}
          strokeColor={colors.background}
          data={pieData}
          radius={110}
          innerRadius={80}
          innerCircleColor={colors.background}
          // centerLabelComponent={renderPieInnerComponent}
        />
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <ScrollView
          horizontal
          centerContent
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pieDescription}
        >
          {pieData.map((item) => {
            return (
              <View key={item.color} style={styles.barName}>
                <View style={[styles.icon, { backgroundColor: item.color }]} />
                <RNText fontSize={10} style={styles.fontWeight300}>{`${item.text} `}</RNText>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}
export default PieChart;
