import { useMemo } from 'react';
import { View } from 'react-native';
import { MATERIAL_COLOR } from 'utils/constants';
import { styles } from './styles';

export default function ProgressLineChart({
  data = [],
  title = 'title',
  value = 'value',
}: {
  data: { title?: string; value: number; color?: string }[] | object[];
  title?: string;
  value?: string;
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
              width: `${getProgressBarWidth(item.value)}%`,
              backgroundColor: item.color || MATERIAL_COLOR[index],
            }}
          />
        );
      })}
    </View>
  );
}
