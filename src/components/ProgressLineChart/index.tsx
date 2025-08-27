import { useMemo } from 'react';
import { View } from 'react-native';
import { MATERIAL_COLOR } from 'utils/constants';
import { styles } from './styles';

export default function ProgressLineChart({
  data = [],
  title = 'title',
  value = 'value',
  height = 14
}: {
  data: { title?: string; value: number; color?: string }[] | object[];
  title?: string;
  value?: string;
  height?: number;
}) {
  const totalAmount = useMemo(() => {
    return data && data.reduce((prev, cur) => (prev += cur[value]), 0);
  }, [data]);

  const getProgressBarWidth = (value: number) => {
    return ((value / totalAmount) * 100).toFixed(2);
  };

  return (
    <View style={styles.progressBar}>
      {data?.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              height,
              width: `${getProgressBarWidth(item.value)}%`,
              backgroundColor: item.color || MATERIAL_COLOR[index],
            }}
          />
        );
      })}
    </View>
  );
}
