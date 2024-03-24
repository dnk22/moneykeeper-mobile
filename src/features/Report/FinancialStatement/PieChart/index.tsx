import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { PieChart as PieChartComponent } from 'react-native-gifted-charts';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import { useAppSelector } from 'store/index';
import {
  selectDataDetailLevel1,
  selectDataDetailLevel2,
  selectViewType,
} from '../reducer/financialStatement.selector';
import styles from './styles';
import { MATERIAL_COLOR } from 'utils/constant';

function PieChart() {
  const { colors } = useCustomTheme();
  const dataLv1 = useAppSelector((state) => selectDataDetailLevel1(state));
  const dataLv2 = useAppSelector((state) => selectDataDetailLevel2(state));
  const isOwnedViewType = useAppSelector((state) => selectViewType(state));

  const dataFocus = useMemo(
    () => (dataLv2 && dataLv2.length ? dataLv2 : dataLv1),
    [dataLv1, dataLv2],
  );

  const pieData = useMemo(() => {
    return [...dataFocus].map((item, index) => ({
      color: MATERIAL_COLOR[index || 0],
      value: item.value,
      text: item.relatedPerson || item.accountName,
    }));
  }, [dataLv1, dataLv2]);

  const totalCurrentAccount = () => {
    if (!pieData.length) {
      return 0;
    }
    return formatNumber(
      dataFocus.reduce((total, current) => (total += current.value), 0),
      true,
    );
  };

  const innerTitle = useMemo(() => {
    if (dataLv2 && dataLv2.length) {
      return dataLv2[0].categoryName || dataLv2[0].accountTypeName;
    } else {
      return isOwnedViewType ? 'Tổng Sở hữu' : 'Tổng dư nợ';
    }
  }, [isOwnedViewType, dataLv2]);

  const renderPieInnerComponent = () => {
    return (
      <View style={styles.pieInnerCenter}>
        <RNText fontSize={14} style={styles.fontWeight300}>
          {innerTitle}
        </RNText>
        <RNText fontSize={18} style={styles.totalAmount}>
          {totalCurrentAccount()}
        </RNText>
      </View>
    );
  };

  return (
    <>
      <View style={styles.pieChart}>
        <PieChartComponent
          // showGradient
          donut
          strokeWidth={4}
          strokeColor={colors.background}
          data={pieData}
          radius={110}
          innerRadius={85}
          innerCircleColor={colors.background}
          centerLabelComponent={renderPieInnerComponent}
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
