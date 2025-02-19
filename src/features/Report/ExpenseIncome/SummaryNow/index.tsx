import { ScrollView, View } from 'react-native';
import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatDateLocal } from 'utils/date';
import RNText from 'components/Text';

import { LineChart } from 'react-native-gifted-charts';
import Item from './Item';
import styles from '../styles';

function SummaryNow() {
  const lineData = [
    { value: 10, dataPointText: '0' },
    { value: 10, dataPointText: '10' },
    { value: 8, dataPointText: '8' },
    { value: 58, dataPointText: '58' },
    { value: 56, dataPointText: '56' },
    { value: 78, dataPointText: '78' },
    { value: 74, dataPointText: '74' },
    { value: 98, dataPointText: '98' },
  ];

  const lineData2 = [
    { value: 12, dataPointText: '0' },
    { value: 20, dataPointText: '20' },
    { value: 18, dataPointText: '18' },
    { value: 40, dataPointText: '40' },
    { value: 36, dataPointText: '36' },
    { value: 60, dataPointText: '60' },
    { value: 54, dataPointText: '54' },
    { value: 85, dataPointText: '85' },
  ];
  return (
    <View style={styles.container}>
      <View style={{ gap: 4, paddingRight: 10 }}>
        <RNText>Theo dõi dòng tiền</RNText>
        <LineChart
          data={lineData}
          data2={lineData2}
          height={160}
          isAnimated
          curved
          hideRules
          animateOnDataChange
          xAxisThickness={0}
          yAxisThickness={0}
          initialSpacing={0}
          dataPointsHeight={3}
          dataPointsWidth={3}
          hideYAxisText
          color1="green"
          color2="red"
          dataPointsColor1="green"
          dataPointsColor2="red"
          textShiftY={-3}
          textShiftX={-5}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          rowGap: 8,
        }}
      >
        <Item title="Hôm nay" />
        <Item
          title="Tuần này"
          startDate={
            new Date(
              formatDateLocal(
                startOfWeek(new Date(), { locale: vi, weekStartsOn: 1 }),
                'yyyy-MM-dd',
              ),
            )
          }
          endDate={
            new Date(
              formatDateLocal(endOfWeek(new Date(), { locale: vi, weekStartsOn: 1 }), 'yyyy-MM-dd'),
            )
          }
        />
        <Item
          title="Tháng này"
          startDate={new Date(formatDateLocal(startOfMonth(new Date()), 'yyyy-MM-dd'))}
          endDate={new Date(formatDateLocal(endOfMonth(new Date()), 'yyyy-MM-dd'))}
        />
        <Item
          title="Quý này"
          startDate={new Date(formatDateLocal(startOfQuarter(new Date()), 'yyyy-MM-dd'))}
          endDate={new Date(formatDateLocal(endOfQuarter(new Date()), 'yyyy-MM-dd'))}
        />
        <Item
          title="Năm nay"
          startDate={new Date(formatDateLocal(startOfYear(new Date()), 'yyyy-MM-dd'))}
          endDate={new Date(formatDateLocal(endOfYear(new Date()), 'yyyy-MM-dd'))}
        />
      </ScrollView>
    </View>
  );
}

export default SummaryNow;
