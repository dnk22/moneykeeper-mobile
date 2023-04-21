import { View } from 'react-native';
import { RNText, SvgIcon } from 'components/index';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

function Summary() {
  const { colors } = useCustomTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.item}>
        <View style={styles.title}>
          <SvgIcon name="arrowCircleUp" color="green" size={14} />
          <RNText fontSize={14}>Tổng Thu</RNText>
        </View>
        <View>
          <RNText fontSize={16}>20000000</RNText>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <View style={styles.title}>
          <SvgIcon name="arrowCircleDown" color="red" size={14} />
          <RNText fontSize={14}>Tổng Chi</RNText>
        </View>
        <View>
          <RNText fontSize={16}>20000000</RNText>
        </View>
      </View>
    </View>
  );
}
export default Summary;
